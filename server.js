var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");

//Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server

var cheerio = require("cheerio");
var axios = require("axios");

// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();


// Configure middleware
// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/scraperHW", {
  useNewUrlParser: true
});

// Routes

// A GET route for scraping the echoJS website
app.get("/scrape", function (req, res) {
// Make a request via axios to grab the HTML body from the site of your choice
axios.get("https://screenrant.com/movie-news/").then(function (response) {
  // Load the HTML into cheerio and save it to a variable
  // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
  var $ = cheerio.load(response.data);

  // Select each element in the HTML body from which you want information.
  // NOTE: Cheerio selectors function similarly to jQuery's selectors,
  // but be sure to visit the package's npm page to see how it works
  $("article.browse-clip").each(function (i, element) {
    //console.log(element)

    // An empty array to save the data that we'll scrape
    var result = [];

    var title = $(element).children().find("a.bc-title-link").text();
    // var link = $(element).find("a.bc-img-link").href()
    var link = $(element).children("a").attr("href")
    var detail = $(element).find("p.bc-excerpt").text()
    // var image = $(element).children().find("a.bc-img-link")

    // check if title already exist in the Article.
    // Article.findOne({
    //   title: result.title
    // }, function (err, data) {

    //   if (data) {
    //     console.log("This article already exists in db")
    //   } else {
    // Save these results in an object that we'll push into the results array we defined earlier
    result.push({
      title: title,
      link: link,
      detail: detail,
      // image: image
    });

    // Create a new Article using the `result` object built from scraping
    db.Article.create(result)
      .then(function (dbArticle) {
        // View the added result in the console
        console.log(dbArticle);
      })
      .catch(function (err) {
        // If an error occurred, send it to the client
        return res.json(err);
      });
    // }
  });
});

// If we were able to successfully scrape and save an Article, send a message to the client
res.send("Scrape Complete");
});
// });
// Route for getting all Articles from the db
app.get("/articles", function (req, res) {
  // Grab every document in the Articles collection
  db.Article.find({})
    .then(function (dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function (req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findOne({
      _id: req.params.id
    })
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function (dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function (req, res) {
  // Create a new note and pass the req.body to the entry
  db.Note.create(req.body)
    .then(function (dbNote) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.findOneAndUpdate({
        _id: req.params.id
      }, {
        $push: {
          note: dbNote._id
        }
      }, {
        new: true
      });
    })
    .then(function (dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});
// Start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});
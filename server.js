var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

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
      var link = $(element).children().attr("href")
      var detail = $(element).find("p.bc-excerpt").text()
      // var link = $(element).find("a").attr("href");

      // Save these results in an object that we'll push into the results array we defined earlier
      result.push({
        title: title,
        link: link,
        detail: detail
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
    });

    // Log the results once you've looped through each of the elements found with cheerio
    console.log(results);
  });
});
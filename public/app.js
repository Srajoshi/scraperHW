// Grab the articles as a json
$.getJSON("/articles", function (data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    
    var artId = data[i]._id;
    var artTitle = data[i].title;
    var artDetail = data[i].detail;
    var artLink = data[i].link;
    // var artImage = data[i].image;
    console.log(artTitle)

    var divCard = $("<div>").addClass("card main-card");
    // divCard.attr("style", "height: 200px; width: 95%; margin: 5px; border:2px solid black");
     var divCardHeader = $("<div>").addClass("card-header");
    //  divCardHeader.text(artTitle);
     divCardHeader.html("<a href='https://screenrant.com" + artLink + "'><h3>" + artTitle + "</h3></a>");
     divCard.append(divCardHeader);
    //  var h5CardTitle = $("<h5>").addClass("card-title");
    //  h5CardTitle.text(artTitle)
    //  divCard.append(h5CardTitle);
     var divCardBody = $("<div>").addClass("card-body");
     divCardBody.attr("style", "overflow:auto");
     divCardBody.html("<h4>" + artDetail +"</h4>")
     divCard.append(divCardBody);
     
    // var divrow = $("<div>").addClass("row");
    // var divcol1 = $("<div>").addClass("col-6");
    // var divcol2 = $("<div>").addClass("col-3");
    // var divcol3 = $("<div>").addClass("col-3 text-right");
    // var deleteButton = $("<button>").addClass("btn btn-info delete-articleFromDB");
    // divCard.append(deleteButton);
    var addNoteBtn = $("<button>").addClass("btn btn-info add-note");
    addNoteBtn.attr("data-id", artId);
    addNoteBtn.text("Add Comment")
    divCard.append(addNoteBtn);
    // // var imgTag = $("<img>");
    // // imgTag.attr("style", " height: 200px;");
    // var addButton = $("<div>").addClass("card-footer");
    // var aHref = $("<a>");
    // var strarr = artLink.split(".com");
    
    // h5CardTitle.text(artTitle);
    // console.log(h5CardTitle)
    // aHref.attr("href", artLink);
    // aHref.text(strarr[0] + "....");
    // aHref.attr("target", "_blank");

    // // var pTag = $("<p>");
    // divcol1.text(artDetail);
    // // ulTag.append(liTag);

    // deleteButton.text("Delete");
    // deleteButton.attr("id", idInDB);

   

    $("#articles").append(divCard);
    // imgTag.attr("src", image);
    //  $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].detail + "<br />" + data[i].link  + "</p>");
  }
});


// Whenever someone clicks add-note button tag
$(document).on("click", ".add-note", function () {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
    // With that done, add the note information to the page
    .then(function (data) {
      console.log(data);
      // The title of the article
      $("#notes").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function () {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        // Value taken from title input
        title: $("#titleinput").val(),
        // Value taken from note textarea
        body: $("#bodyinput").val()
      }
    })
    // With that done
    .then(function (data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});
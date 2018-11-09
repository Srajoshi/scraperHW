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
        divCardHeader.html("<a href='https://screenrant.com" + artLink + "'><h4>" + artTitle + "</h4></a>");
        divCard.append(divCardHeader);
        var divCardBody = $("<div>").addClass("card-body");
        divCardBody.attr("style", "overflow:auto");
        divCardBody.html("<h5>" + artDetail + "</h5>")
        divCard.append(divCardBody);

       

        var addNoteBtn = $("<button>").addClass("btn btn-info add-note modal-trigger");
        addNoteBtn.attr("data-id", artId)
        // addNoteBtn.attr("data-target", "#notes");
        // addNoteBtn.attr("data-toggle", "modal")
        addNoteBtn.text("Add Comment")
        divCard.append(addNoteBtn);


        $("#articles").append(divCard);
        
        //  $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].detail + "<br />" + data[i].link  + "</p>");
    }
});




// Whenever someone clicks add-note button tag
$(document).on("click", ".add-note", function () {
    // $('.modal').toggleClass('modal--show');
    
    // Empty the notes from the note section
    $("#notes").empty();
    // Save the id from the button
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
        $("#notes").append("<h5>" + data.title + "</h5>");
        // An input to enter a new title
        $("#notes").append("<br>Comment Title:<br><input id='titleinput' name='title'><br>");
        // A textarea to add a new note body
        $("#notes").append("<br>Comments :<br><textarea id='bodyinput' name='body'></textarea>");
        // A button to submit a new note, with the id of the article saved to it
        $("#notes").append("<br><button data-id='" + data._id + "' id='savenote'>Save Note</button>");
  
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
        // $(".modalNote").modal("hide");
      });
  
    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });
  

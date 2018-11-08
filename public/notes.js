// Grab the notes as a json
$.getJSON("/notes", function (data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page

      var noteId = data[i]._id;
      var noteTitle = data[i].title;
      var noteBody = data[i].body;
      // var artImage = data[i].image;
      console.log(noteId)

      var divCard = $("<div>").addClass("card main-card");
      // divCard.attr("style", "height: 200px; width: 95%; margin: 5px; border:2px solid black");
      var divCardHeader = $("<div>").addClass("card-header");
      //  divCardHeader.text(artTitle);
      divCardHeader.html("<h4>" + noteTitle + "</h4></a>");
      divCard.append(divCardHeader);
      var divCardBody = $("<div>").addClass("card-body");
      // divCardBody.attr("style", "overflow:auto");
      divCardBody.html("<h5>" + noteBody + "</h5>")
      divCard.append(divCardBody);

     

      var deleteNoteBtn = $("<button>").addClass("btn btn-info delete-note modal-trigger");
      deleteNoteBtn.attr("data-id", noteId)
      // addNoteBtn.attr("data-target", "#notes");
      // addNoteBtn.attr("data-toggle", "modal")
      deleteNoteBtn.text("Delete Comment")
      divCard.append(deleteNoteBtn);


      $("#saved-notes").append(divCard);
      
      //  $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].detail + "<br />" + data[i].link  + "</p>");
  }
});

$(document).on("click", ".delete-note", function () {

  var thisId = $(this).attr("data-id");

  var data = {
      "_id": thisId
  };
  console.log(data);
  $.ajax({
      type: "DELETE",
      url: "/deletenote/:id",
      data: data,
      success: function (data, textStatus) {
          $("#" + thisId).remove();
      }
  })
  $.getJSON("/notes", function (data) {
    // For each one
    $("#saved-notes").empty();
    for (var i = 0; i < data.length; i++) {
        // Display the apropos information on the page
  
        var noteId = data[i]._id;
        var noteTitle = data[i].title;
        var noteBody = data[i].body;
        // var artImage = data[i].image;
        console.log(noteId)
  
        var divCard = $("<div>").addClass("card main-card");
        // divCard.attr("style", "height: 200px; width: 95%; margin: 5px; border:2px solid black");
        var divCardHeader = $("<div>").addClass("card-header");
        //  divCardHeader.text(artTitle);
        divCardHeader.html("<h4>" + noteTitle + "</h4></a>");
        divCard.append(divCardHeader);
        var divCardBody = $("<div>").addClass("card-body");
        // divCardBody.attr("style", "overflow:auto");
        divCardBody.html("<h5>" + noteBody + "</h5>")
        divCard.append(divCardBody);
  
       
  
        var deleteNoteBtn = $("<button>").addClass("btn btn-info delete-note modal-trigger");
        deleteNoteBtn.attr("data-id", noteId)
        // addNoteBtn.attr("data-target", "#notes");
        // addNoteBtn.attr("data-toggle", "modal")
        deleteNoteBtn.text("Delete Comment")
        divCard.append(deleteNoteBtn);
  
  
        $("#saved-notes").append(divCard);
        
        //  $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].detail + "<br />" + data[i].link  + "</p>");
    }
  });
  

});

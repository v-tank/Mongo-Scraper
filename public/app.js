// JS file
$(document).ready(function() {
  $("#scrape-btn").on("click", function(e) {
    $.ajax({
      method: "GET",
      url: "/scrape"
    }).then(function(response) {
      location.reload();
    });
  });

  $(document).on('click', '#save-article-btn', function (event) {
    event.preventDefault();

    var btnId = $(this).attr("data-id");

    $.ajax({
      method: "GET",
      url: "articles/" + btnId
    })
    location.reload();
  });

  $(document).on('click', '#unsave-article-btn', function (event) {
    event.preventDefault();

    var id = $(this).attr("data-id");

    $.ajax({
      method: 'GET',
      url: "articles/" + id
    })
    location.reload();
  })

  $(document).on('click', '#add-note-btn', function (event) {
    event.preventDefault();

    var btnId = $(this).attr("data-id");

    $.ajax({
      method: "GET",
      url: "note/" + btnId
    }).then(function(data) {
      if (data.notes) {
        $("#note-text").val(data.notes.body);
      }
    });
  });

  $(document).on('click', '#save-note', function (event) {
    event.preventDefault();

    var id = $(this).attr("data-id");
    var message = $("#note-text").val().trim();
    var title = $("#note-title").val().trim();

    $.ajax({
      method: 'POST',
      data: { 
        title: title,
        body: message },
      url: "/note/" + id
    })
      .then(function (data) {
        // console.log(data.body);

        //if(data.body){
        $("#note-text").val(data.body);
        $("#note-title").val(data.title);
        //};
      });
  });
})
// JS file
$(document).ready(function() {
  $("#scrape-btn").on("click", function(e) {
    $.get("/scrape", function(res) {
      console.log("Scraped.");
    });
  });
})
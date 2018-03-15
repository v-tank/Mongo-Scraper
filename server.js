var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var PORT =  3000;

var app = express();

app.use(logger("dev"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/techNews");

app.get("/", function(req, res) {
  db.Article.find({}).sort({_id: -1}).then(function(result) {
    res.render("index", {articles: result});
  })
})

app.get("/scrape", function(req, res) {
  axios.get("https://techcrunch.com/").then(function(response) {

    var $ = cheerio.load(response.data);

    // console.log("out here");
    
    $(".post-block").each(function (i, element) {
      // console.log("in here");

      var dataToSave = {};

      var title = $(element).children().find('h2.post-block__title').text().trim();
      var author = $(element).children().find('span.river-byline__authors').find('a').text().trim();
      var time = $(element).children().find('.river-byline__time').text().trim();
      // var excerpt = $(element).children().find('.post-block__content').find('p');
      var link = $(element).children().find('.post-block__media').find('img').attr('src');

      // console.log(title);

      dataToSave = {
        title: title,
        author: author,
        time: time,
        // excerpt: excerpt,
        link: link
      }

      console.log(dataToSave);
      
      db.Article.create(dataToSave)
        .then(function(dbArticle) {
          // console.log(dbArticle);
          
        })
        .catch(function(error) {
          return;
        });
    });
    console.log("Scrape complete.");
    res.redirect("/");
  });
});


app.listen(PORT, function() {
  console.log("App running on port " + PORT + ".");
});
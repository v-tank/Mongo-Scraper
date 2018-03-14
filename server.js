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

app.get("/scrape", function(req, res) {
  axios.get("https://techcrunch.com/").then(function(response) {
    var $ = cheerio.load(response.data);

    $("article.post-block").each(function (i, element) {

      var dataToSave = {};

      var title = $(element).children().find('h2.post-block__title').text();
      var author = $(element).children().find('span.river-byline__authors').find('a').text();
      var time = $(element).children().find('time.river-byline__time').text().trim();
      var excerpt = $(element).children().find('div.post-block__content').text();
      var link = $(element).children().find('footer.post-block__footer').find('img').attr('src');
      
      dataToSave = {
        title: title,
        author: author,
        time: time,
        excerpt: excerpt,
        link: link
      }
      
      console.log(dataToSave);

      db.Article.create(dataToSave)
        .then(function(dbArticle) {
          console.log(dbArticle);
        })
        .catch(function(error) {
          return res.json(err);
        });
    });

    res.send("Scrape complete.");
  });
});

app.get("/articles", function(req, res) {
  db.Article.find({}).then(function(result) {
    res.json(result);
  })
})

app.listen(PORT, function() {
  console.log("App running on port " + PORT + ".");
});
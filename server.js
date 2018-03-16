var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var PORT =  process.env.PORT || 3000;

var app = express();

app.use(logger("dev"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/techNews"

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

app.get("/", function(req, res) {
  db.Article.find({ "saved": false }, function (err, data) {
    if (!data) {
      res.render("alert", {message: "Press the 'Scrape' button to retrieve new articles!"})
    } else {
      res.render("index", { articles: data });
    }
  });
});

app.get("/scrape", function(req, res) {
  axios.get("https://techcrunch.com/").then(function(response) {

    var $ = cheerio.load(response.data);
    
    $(".post-block").each(function (i, element) {

      var dataToSave = {};

      var title = $(element).children().find('h2.post-block__title').text().trim();
      var author = $(element).children().find('span.river-byline__authors').find('a').text().trim();
      var time = $(element).children().find('.river-byline__time').text().trim();
      var articleLink = $(element).children().find('h2.post-block__title').find('a').attr("href");
      var imgLink = $(element).children().find('.post-block__media').find('img').attr('src').replace("crop=1", "crop=2");

      dataToSave = {
        title: title,
        author: author,
        time: time,
        articleLink: articleLink,
        imgLink: imgLink
      }

      console.log(dataToSave);
      
      db.Article.create(dataToSave)
        .then(function(dbArticle) {
          console.log(dbArticle);
        })
        .catch(function(error) {
          return;
        });
    });
    console.log("Scrape complete.");
    res.redirect("/");
  });
});

app.get("/articles", function (req, res) {
  db.Article.find({ saved: false })
    .populate('note')
    .then(function (dbArticle) {
      
      res.redirect("/saved");
    })
    .catch(function (err) {
      res.json(err);
    });
});

app.get('/articles/:id', function (req, res) {

  db.Article.findOne({ _id: req.params.id }).then(function (article) {

    if (!article.saved) {
      db.Article.findOneAndUpdate({ _id: req.params.id }, { $set: { saved: true } })
        .then(function (dbArticle) {
          console.log("Article was saved.");
          res.redirect("/saved");
        })
        .catch(function (err) {
          return res.json(err)
        })
    } else {
      console.log('Unsaving note.')
      db.Article.findOneAndUpdate({ _id: req.params.id }, { $set: { saved: false } })
        .then(function (dbArticle) {
          console.log('Article unsaved.')
          res.redirect("/");
        })
        .catch(function (err) {
          return res.json(err)
          console.log(err)
        })
    }
  });
});

app.get('/saved', function (req, res) {
  db.Article.find({ saved: true })
    .populate('note')
    .then(function (dbArticle) {
      res.render("saved", { dbArticle });
    })
    .catch(function (err) {
      return res.json(err);
    });
});

app.post("/note/:id", function (req, res) {
  db.Note.create(req.body)
    .then(function (dbNote) {
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { notes: dbNote._id } }, { new: true });
    })
    .then(function (dbNote) {
      res.json(req.body)
    })
    .catch(function (err) {
      res.json(err);
    });
});

app.get('/note/:id', function (req, res) {
  db.Article.findOne({ _id: req.params.id })
    .populate('note')
    .then(function (dbNote) {
      console.log(dbNote.notes);
      // dbNote.forEach(function(el) { 
      //   console.log(dbNote.notes(el)) 
      // });
      // res.json(dbNote);
      // res.render("saved", { dbNote: dbNote});
    })
    .catch(function (err) {
      return res.json(err);
    });
});

app.listen(PORT, function() {
  console.log("App running on port " + PORT + ".");
});
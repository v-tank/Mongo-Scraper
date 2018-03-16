// Article model
var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  author: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  articleLink: {
    type: String,
    required: true
  },
  imgLink: {
    type: String,
    required: true
  },
  saved: {
    type: Boolean,
    required: true,
    default: false
  },

  notes: [{
    type: Schema.Types.ObjectId,
    ref: "Note"
   }
  ]
});

var Article = mongoose.model("Article", ArticleSchema);

// Export the Article model
module.exports = Article;

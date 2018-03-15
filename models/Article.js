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
  link: {
    type: String,
    required: true
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

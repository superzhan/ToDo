var mongoose = require('mongoose');
var timeTool = require('./timeTool');

var TodoSchema = new mongoose.Schema({
  completed: Boolean,
  note: String,
  updated_at: { type: Date, default: timeTool.getCurDate()},
});
module.exports = mongoose.model('Todo', TodoSchema);

var mongoose = require('mongoose');
var timeTool = require('./timeTool');

var ToDoSchema = new mongoose.Schema({
  completed: Boolean,
  note: String,
  userId : mongoose.Schema.Types.ObjectId,
  updated_at: { type: Date, default: timeTool.getCurDate()},
});
module.exports = mongoose.model('Todo', ToDoSchema);


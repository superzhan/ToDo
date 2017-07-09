/**
 * Created by superzhan on 7/9/17.
 */

var mongoose = require('mongoose');
var timeTool = require('./timeTool');

var UserSchema = new mongoose.Schema({

    name : String,
    password :String,
    updated_at: { type: Date, default: timeTool.getCurDate()}
});
module.exports = mongoose.model('User', UserSchema);
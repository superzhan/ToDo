
var config = require('../../mongoConfig.json');

var connectStr = '';
if(config.isAuth)
{
  connectStr='mongodb://'+config.username+':'+config.password+'@'+config.host$
}else
{
  connectStr='mongodb://'+config.host+':'+config.port+'/'+config.database;
}
console.log(connectStr);

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(connectStr)
    .then(function () {console.log('connection succesful')})
    .catch(function (err) {console.error(err)});

module.exports = mongoose;
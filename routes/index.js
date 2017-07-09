var express = require('express');
var router = express.Router();

var todoSchema = require('../api/public/todoSchema');
var timeTool = require('../api/public/timeTool');

var request = require("request");


function requestPostAPI(api,reqBody,callback)
{
  var ipAddr = "http://localhost:3000/";
  var options = { method: 'POST',
                  url:  ipAddr+api,
                  headers: 
                   {'content-type': 'application/json' },
                  body: reqBody,
                  json: true };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);
     
     callback(error, response, body);
  });
}

/* GET home page. */
router.get('/', function(req, res, next) {

  requestPostAPI('todo/getUndoItem',req.body,function (error, response, body) {
    if (error) throw new Error(error);

     res.render('todo',{data:body});
   });

});

router.post('/addItem',function(req,res,next){

    requestPostAPI('todo/addItem',req.body,function (error, response, body) {
        if (error) throw new Error(error);

        res.redirect('/');
    });

});

router.post('/finishItem',function(req,res,next){

    requestPostAPI('todo/updateItem',req.body,function (error, response, body) {
        if (error) throw new Error(error);

        res.redirect('/');
    });

});

router.get('/getFinishItem',function(req,res,next){

    requestPostAPI('todo/getFinishItem',req.body,function (error, response, body) {
        if (error) throw new Error(error);

        console.log("index " + JSON.stringify(body));
        res.render('finishTodo', {"data":body});
    });

});

module.exports = router;

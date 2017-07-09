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

  //  var options = { method: 'POST',
  //                 url: 'http://localhost:3000/todo/getUndoItem',
  //                 headers: 
  //                  {'content-type': 'application/json' },
  //                 body: 
  //                  { },
  //                 json: true };

  // request(options, function (error, response, body) {
  //   if (error) throw new Error(error);

  //   res.render('todo',{data:body});
  // });

  requestPostAPI('todo/getUndoItem',req.body,function (error, response, body) {
    if (error) throw new Error(error);

     res.render('todo',{data:body});
   });

});

router.post('/addItem',function(req,res,next){

  var item = {};
  item.note =req.body.note;
  item.completed=false;
  item.updated_at =timeTool.getCurDate();	
  todoSchema.create(item,function(err,post){
  	if(err)
  	{
  		next(err);
  	}else
  	{
       res.redirect('/');
  	}
  });

});

router.post('/finishItem',function(req,res,next){

  var item = {};
  item._id =req.body._id;
  item.completed=true;
  item.updated_at =timeTool.getCurDate();	
  todoSchema.findByIdAndUpdate(item._id,item,function(err,post){
  	if(err)
  	{
  		next(err);
  	}else
  	{
       res.redirect('/');
  	}
  });

});

router.get('/getFinishItem',function(req,res,next){

  todoSchema.find({"completed":true},function(err,data){
		if(err){
			next(err);
		}else
		{
			for(var i=0;i<data.length;++i)
			{
				var curDate= data[i].updated_at;
				data[i].finishTime =  timeTool.getDateString(curDate);
			}

			res.render('finishTodo', {"data":data});
		}
	});

});

module.exports = router;

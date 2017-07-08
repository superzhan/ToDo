var express = require('express');
var router = express.Router();

var todoSchema = require('../api/public/todoSchema');
var timeTool = require('../api/public/timeTool');


/* GET home page. */
router.get('/', function(req, res, next) {

	todoSchema.find({"completed":false},function(err,data){
		if(err){
			next(err);
		}else
		{
			res.render('todo', {"data":data});
		}
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

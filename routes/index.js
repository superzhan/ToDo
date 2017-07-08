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




module.exports = router;

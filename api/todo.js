var express = require('express');
var router = express.Router();
var todoSchema = require('./public/todoSchema');
var timeTool = require('./public/timeTool');


/* GET users listing. */
router.get('/', function(req, res, next) {
  
   res.send("request api");

});


/* GET users listing. */

router.post('/getItem', function(req, res, next) {
  
    todoSchema.findOne({"_id":req.body._id},function(err,data){
    	if(err){
    		next(err);
    	}else
    	{
    		res.json(data);
    	}
    });

});


router.post('/getItemList', function(req, res, next) {
  
    todoSchema.find(function(err,data){
    	if(err){
    		next(err);
    	}else
    	{
    		res.json(data);
    	}
    });

});

router.post('/addItem', function(req, res, next) {

  var item = req.body;
  item.updated_at =timeTool.getCurDate();	
  todoSchema.create(item,function(err,post){
  	if(err)
  	{
  		next(err);
  	}else
  	{
       res.json(post);
  	}
  });

});

router.post('/updateItem', function(req, res, next) {

  var item = req.body;
  item.updated_at =timeTool.getCurDate();	

  todoSchema.findByIdAndUpdate(item._id, item,function(err,post){
  	if(err)
  	{
  		next(err);
  	}else
  	{
       res.json(post);
  	}
  });
});

router.post('/deleteItem', function(req, res, next) {
  todoSchema.findByIdAndRemove(req.body._id,  function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

router.post('/deleteAllItem', function(req, res, next) {
  todoSchema.remove({}, function (err, post) {
    if (err) return next(err);
    res.json({'msg':'remove all'});
  });
});



module.exports = router;
var express = require('express');
var router = express.Router();
var TodoSchema = require('./public/TodoSchema');
var timeTool = require('./public/timeTool');


/* GET users listing. */
router.get('/', function(req, res, next) {
  
   res.send("request api");

});




router.post('/getItem', function(req, res, next) {
  
    TodoSchema.findOne({"_id":req.body._id},function(err, data){
    	if(err){
    		next(err);
    	}else
    	{
    		res.json(data);
    	}
    });

});

/*返回未完成的Item*/
router.post('/getUnDoItem', function(req, res, next) {
    TodoSchema.find({"completed":false},function(err, data){
    if(err){
      next(err);
    }else
    {
      res.json(data);
    }
  });

});


router.post('/getFinishItem' , function (req, res, next) {

    TodoSchema.find({"completed":true}).sort({updated_at:-1}).exec(function(err, data){
        if(err){
            next(err);
        }else
        {
            var resArray = new Array();
            for(var i=0;i<data.length;++i)
            {
                var curDate= data[i].updated_at;
                var item ={"_id":data[i]._id, "note":data[i].note ,"finishTime":timeTool.getDateString(curDate)};
                resArray[i]=item
            }

            //console.log("todo " + JSON.stringify(resArray));
            res.json(resArray);
        }
    });
});

router.post('/getItemList', function(req, res, next) {
  
    TodoSchema.find(function(err, data){
    	if(err){
    		next(err);
    	}else
    	{
    		res.json(data);
    	}
    });

});

router.post('/addItem', function(req, res, next) {

    var item = {};
    item.note =req.body.note;
    item.completed=false;
    item.updated_at =timeTool.getCurDate();
    TodoSchema.create(item,function(err, post){
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

    var item = {};
    item._id =req.body._id;
    item.completed=true;
    item.updated_at =timeTool.getCurDate();
    TodoSchema.findByIdAndUpdate(item._id,item,function(err, post){
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
  TodoSchema.findByIdAndRemove(req.body._id,  function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

router.post('/deleteAllItem', function(req, res, next) {
  TodoSchema.remove({}, function (err, post) {
    if (err) return next(err);
    res.json({'msg':'remove all'});
  });
});



module.exports = router;
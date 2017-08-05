var express = require('express');
var router = express.Router();
var TodoSchema = require('./public/TodoSchema');
var UserSchema = require('./public/UserSchema');
var timeTool = require('./public/timeTool');
var mongoose = require('mongoose');


var crypto = require('crypto');


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

    if(req.body.userId==null)
    {
        res.json({code:500,msg:"request error"});
        return;
    }

    var userId =mongoose.Types.ObjectId(req.body.userId);
    TodoSchema.find({"completed":false ,"userId":userId},function(err, data){
    if(err){
      next(err);
    }else
    {
      res.json(data);
    }
  });

});


router.post('/getFinishItem' , function (req, res, next) {

    if(req.body.userId==null)
    {
        res.json({code:500,msg:"request error"});
        return;
    }

    var userId =mongoose.Types.ObjectId(req.body.userId);
    TodoSchema.find({"completed":true,"userId":userId}).sort({updated_at:-1}).exec(function(err, data){
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

    if(req.body.userId==null)
    {
        res.json({code:500,msg:"request error"});
        return;
    }

    var userId =mongoose.Types.ObjectId(req.body.userId);
    TodoSchema.find({"userId":userId},function(err, data){
    	if(err){
    		next(err);
    	}else
    	{
    		res.json(data);
    	}
    });

});

router.post('/addItem', function(req, res, next) {

    if(req.body.userId==null || req.body.note == null)
    {
        res.json({code:500,msg:"request error"});
        return;
    }

    var item = {};
    item.note =req.body.note;
    item.completed=false;
    item.updated_at =timeTool.getCurDate();
    item.userId = mongoose.Types.ObjectId(req.body.userId);



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

      var userId =mongoose.Types.ObjectId(req.body.userId);
      TodoSchema.remove({"userId":userId}, function (err, post) {
        if (err) return next(err);
        res.json({'msg':'remove all'});
      });
});

/******************************/

router.post('/register',function (req, res, next) {

    var name = req.body.name;
    var password = req.body.password;
    var comfirmPassword = req.body.comfirmPassword;

    if( password != comfirmPassword)
    {
        res.json({code:500,msg:'password is not same'});
        return;
    }

    UserSchema.findOne({'name':name} , function (err, data) {
        if(err)
        {
            res.json({code:500,msg:'check error'});
            return;
        }

        if(data != null)
        {
            console.log(data);
            res.json({code:500,msg:'userName is exist'});
            return;
        }

        var hash = crypto.createHash('sha1');
        hash.update(password);
        password = hash.digest('hex');

        var userInfo={};
        userInfo.name = name;
        userInfo.password= password;

        UserSchema.create( userInfo,function (err,resData) {
            if(err)
            {
                res.json({code:500,msg:'data base error'});
            }else
            {
                res.json({code:200,msg:'success'});
            }
        });

    });

});

router.post('/login',function (req, res, next) {

    var name = req.body.name;
    var password = req.body.password;

    UserSchema.findOne({'name':name} , function (err, data) {
        if(err)
        {
            res.json({code:500,msg:'data base error'});
            return;
        }

        if(data == null)
        {
            res.json({code:500,msg:'user not exist'});
            return;
        }

        var hash = crypto.createHash('sha1');
        hash.update(password);
        password = hash.digest('hex');
        UserSchema.findOne({'name':name ,'password':password},function (err, data) {
            if(err)
            {
                res.json({code:500,msg:'data base error'});
                return;
            }
            if(data==null)
            {
                res.json({code:500,msg:'password not right'});
                return;
            }


            UserSchema.findOneAndUpdate({name:name ,password:password},
                {updated_at:timeTool.getCurDate()},
                function (err, data) {
                    if(err)
                    {
                        res.json({code:500,msg:'data base error'});
                        return;
                    }
                    res.json({code:200,msg:'success',_id:data._id});
                }
            );

        });

    });

});

module.exports = router;

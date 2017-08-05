var express = require('express');
var router = express.Router();

var todoSchema = require('../api/public/TodoSchema');
var timeTool = require('../api/public/timeTool');

var request = require("request");


function requestPostAPI(api,session,reqBody,callback)
{
    /*添加API Basic Auth 认证*/
    var auth="";
   if(session !=null) {
       var username = session.user.name;
       var password = session.user.password;
       var auth = 'Basic ' + new Buffer(username + ':' + password).toString('base64');
   }

  var ipAddr = "http://localhost:3000/";
  var options = { method: 'POST',
                  url:  ipAddr+api,
                  headers: 
                   {'content-type': 'application/json',
                       authorization: auth
                   },
                  body: reqBody,
                  json: true };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);
     
     callback(error, response, body);
  });
}

/* GET home page. */
router.get('/', function(req, res, next) {

    if(req.session.user ==null)
    {
        res.redirect('/login');
    }

    var user={};
    user.userId = req.session.user._id;

    requestPostAPI('todo/getUndoItem',req.session, user,function (error, response, body) {
        if (error) throw new Error(error);

         res.render('todo',{data:body});
    });

});

router.post('/addItem',function(req,res,next){

    if(req.session.user ==null)
    {
        res.redirect('/login');
    }

    var reqData=req.body;
    reqData.userId = req.session.user._id;

    requestPostAPI('todo/addItem',req.session,reqData,function (error, response, body) {
        if (error) throw new Error(error);

        res.redirect('/');
    });

});

router.post('/finishItem',function(req,res,next){

    requestPostAPI('todo/updateItem',req.session,req.body,function (error, response, body) {
        if (error) throw new Error(error);

        res.redirect('/');
    });

});

router.get('/getFinishItem',function(req,res,next){

    if(req.session.user ==null)
    {
        res.redirect('/login');
    }

    var user={};
    user.userId = req.session.user._id;

    requestPostAPI('todo/getFinishItem',req.session,user,function (error, response, body) {
        if (error) throw new Error(error);

        //console.log("index " + JSON.stringify(body));
        res.render('finishTodo', {"data":body});
    });

});


router.get('/login',function (req, res, next) {

    res.render('login',{isRightName:true});
});
router.post('/login',function (req, res, next) {

    requestPostAPI('todo/login',null,req.body,function (error, response, body) {
        if (error) {
            next(error)
        }
        else if(body.code ===200){

            var usrData={_id:body._id, name: req.body.name, password :req.body.password};
            req.session.user = usrData;
            res.redirect('/');

        }
        else {
            res.render('login',{isRightName:false});
        }
    });
});

router.get('/register',function (req, res, next) {

    res.render('register',{message:""});
});

router.post('/register',function (req, res, next) {

    requestPostAPI('todo/register',null,req.body,function (error, response, body) {
        if (error) {
            next(error)
        }
        else if(body.code ===200){
            res.redirect('/login');

        }
        else {
            res.render('register',{message:body.msg});
        }
    });
});


module.exports = router;

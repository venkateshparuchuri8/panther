var express = require('express');
var actionRouter = express.Router();
var actionService = require('../services/action');

actionRouter.post('/list/:lesson_id',function(req,res,next){
var lesson_id=req.params.lesson_id;
actionService.getAllNewActions(lesson_id,function(err, result){
  if (err) {
          res.status(500).send(err);
      } else {
          var object = {};
          object.status = 'success';
          object.result = result;
          res.status(200).send(object);
          //res.send(null, result);
      }
})
})

actionRouter.post('/create',function(req,res,next){
	var actionObj = req.body;
  actionObj.created_date=new Date();
  actionObj.modified_date=new Date();
  actionService.createNewActions(actionObj, function(err, result) {
      if (err) {
          res.status(500).send(err);
      } else {
          var object = {};
          object.status = 'success';
          object.result = result;
          res.status(200).send(object);
          //res.send(null, result);
      }
  });
})

actionRouter.post('/update',function(req,res,next){
  var actionObj = req.body;
  actionObj.modified_date=new Date();
  actionService.updateActions(actionObj, function(err, result) {
      if (err) {
          res.status(500).send(err);
      } else {
          var object = {};
          object.status = 'success';
          object.result = result;
          res.status(200).send(object);
          //res.send(null, result);
      }
  });
});

actionRouter.get('/getAllUserActions/:user_id',function(req,res,next){
    var user_id = req.params.user_id;
  actionService.getAllUserActions(user_id,function(err,result){
    if(err){
      res.status(500).send(err);
    }else{
      var object = {};
      object.status = 'success';
      object.result = result;
      res.status(200).send(object);
    }
  });
});

actionRouter.put('/updateaction',function(req,res,next){
  var userObj = req.body;
   actionService.updateAction(userObj,function(err,result){
    if(err){
      res.status(500).send(err);
    }else{
      var object={};
      object.status = 'success';
      object.result = result;
      res.status(200).send(object);
    }
  });
});

module.exports = actionRouter;

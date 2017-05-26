var express = require('express');
var memberRouter = express.Router();
var memberService = require('../services/memberdashboard');
var userService = require('../services/user');

memberRouter.post('/course/list/:user_id',function(req,res,next){
  //console.log('comming heare');
  var user_id=req.params.user_id;
  userService.userCourseInfo(user_id, function(err, result) {
  //memberService.getUserCourses(function(err, result) {
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

memberRouter.post('/class/details/:class_id/:user_id',function(req,res,next){
	var class_id=req.params.class_id;
  var user_id = req.params.user_id;
  memberService.getUserClassDetails(class_id, user_id,function(err, result) {
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

memberRouter.post('/task/complete',function(req,res,next){
  var task_obj=req.body;
  console.log(task_obj);
  memberService.taskComplete(task_obj,function(err, result) {
    console.log(err);
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

memberRouter.put('/bookmark',function(req,res,next){
  var bookmarkObj=req.body;
  console.log(bookmarkObj);
  memberService.bookmarking(bookmarkObj,function(err, result) {
    console.log(err);
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

memberRouter.get('/notifications/list/:user_id/:org_id',function(req,res,next){
  var notifyObj={};
notifyObj.user_id=req.params.user_id;
notifyObj.org_id=req.params.org_id;
  memberService.getNotificatonList(notifyObj,function(err, result) {
      if (err) {
          res.status(500).send(err);
      } else {
          var object = {};
          object.status = 'success';
          object.result={};
          object.result.unreaded_notifications_count=underscore.filter(result,underscore.matches({notification_status:'0'})).length;
          object.result.notifications = result;
          res.status(200).send(object);
          //res.send(null, result);
      }
  });
});


//
memberRouter.post('/notifications/status/update/:notification_id/:user_id',function(req,res,next){
  var notifyObj={};
notifyObj.notification_id=req.params.notification_id;
notifyObj.user_id=req.params.user_id;
  memberService.updateNotificationStatus(notifyObj,function(err, result) {
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

module.exports = memberRouter;

var express = require('express');
var lessonRouter = express.Router();
var lessonService = require('../services/lesson');


//get list of lessons for a class
lessonRouter.post('/list/:class_id', function(req, res, next) {
    var class_id = req.params.class_id;
    lessonService.lessonList(class_id, function(err, result) {
        if (err) {
            res.status(500).send(err);
        } else {
            var object = {};
            object.status = 'success';
            object.result = result;
            res.status(200).send(object);
        }
    });
});

lessonRouter.post('/create',function(req,res,next){
  var lessonObject = req.body;
  lessonObject.created_date=new Date();
  lessonObject.modified_date=new Date();
  //lessonObject.sort_order=1;
  lessonService.createNewLesson(lessonObject, function(err, result) {
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

//update lesson details
lessonRouter.post('/update',function(req,res,next){
  var lessonObject = req.body;
  lessonService.updateLesson(lessonObject, function(err, result) {
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

//to publish the draft lesson
lessonRouter.post('/publish/:lesson_id/:class_id', function(req, res, next) {
    var class_id = req.params.class_id;
    var lesson_id=req.params.lesson_id;
    lessonService.publishLesson(lesson_id,class_id, function(err, result) {
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

lessonRouter.post('/:lessonId', function(req, res, next) {
    var lessonId = req.params.lessonId;
    lessonService.getLessonDetails(lessonId, function(err, result) {
      console.log(err);
        if (err) {
            res.status(500).send(err);
        } else {
            var object = {};
            object.status = 'success';
            object.result = result[0];
            res.status(200).send(object);
        }
    });
});

module.exports = lessonRouter;

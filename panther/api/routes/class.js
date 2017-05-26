var express = require('express');
var classRouter = express.Router();
var classService = require('../services/class');

//check for the ribbon availability for the class
classRouter.post('/ribbon/availability/:ribbonId', function(req, res, next) {
    var ribbonId = req.params.ribbonId;
    classService.checkRibbonAvailability(ribbonId, function(err, result) {
        if (err) {
            res.status(500).send(err);
        } else {
            var object = {};
            object.success = 'success';
            object.result = result;
            res.status(200).send(result);
        }
    });
});

//creation class
classRouter.post('/create',function(req,res,next){
  var classObject =req.body;
  classObject.created_date=new Date();
  classObject.modified_date=new Date();
  //classObject.sort_order=1;

  classService.createNewClass(classObject, function(err, result) {
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

//update class details
classRouter.post('/update',function(req,res,next){
  var classObject = req.body;
  classService.updateClass(classObject, function(err, result) {
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


//get list of classes for a course
classRouter.post('/list/:course_id', function(req, res, next) {
    var course_id = req.params.course_id;
    classService.classList(course_id, function(err, result) {
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

//to publish the draft class
classRouter.post('/publish/:class_id/:course_id', function(req, res, next) {
    var class_id = req.params.class_id;
    var course_id=req.params.course_id;
    classService.publishClass(class_id,course_id, function(err, result) {
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

//to draft the published class
classRouter.post('/draft/:class_id/:course_id', function(req, res, next) {
    var class_id = req.params.class_id;
    var course_id=req.params.course_id;
    classService.draftClass(class_id,course_id, function(err, result) {
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

classRouter.post('/available/ribbons/:course_id', function(req, res, next) {
    var course_id = req.params.course_id;
    classService.classRibbons(course_id, function(err, result) {
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

classRouter.post('/:classId', function(req, res, next) {
    var classId = req.params.classId;
    classService.getClassDetails(classId, function(err, result) {
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

module.exports = classRouter;

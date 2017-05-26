var express = require('express');
var courseRouter = express.Router();
var courseService = require('../services/course');

courseRouter.post('/list/:org_id', function(req, res, next) {
	var org_id=req.params.org_id;
	courseService.getAllCourses(org_id, function(err, result){
		if(err){
			res.status(500).send(err);
		}else{
			res.status(201).send(result);
		}
	});
});

//Method for creating course
courseRouter.post('/create',function(req,res,next){
	var body=req.body;
	var courseObject=JSON.parse(body.courseObj);
	courseObject.created_date=new Date();
	courseObject.modified_date=new Date();
	courseService.createNewCourse(courseObject, function(err, result){
		if(err){
			res.status(500).send(err);
		}else{
			res.status(201).send(result);
		}
	});
});

//Method for edit course
courseRouter.post('/edit/:courseId',function(req,res,next){
	var courseId=req.params.courseId;
	courseService.editCourseDetails(courseId, function(err, result){
		if(err){
			res.status(500).send(err);
		}else{
			res.status(200).send(result);
		}
	});
});

courseRouter.post('/updateCourse', function(req, res, next){
	var body=req.body;
	var courseObject=JSON.parse(body.courseObj);
	courseService.updateCourse(courseObject, function(err, result){
    
		if(err){
			res.status(500).send(err);
		}else{
			var object = {};
          	object.status = 'success';
          	object.result = result;
			res.status(200).send(result);
		}
	});
});

courseRouter.post('/:course_id', function(req, res, next){
	var course_id= req.params.course_id;
	courseService.getCourseDetails(course_id, function(err, result){
		if(err){
			res.status(500).send(err);
		}else{
			res.status(200).send(result);
		}
	});
});

module.exports = courseRouter;

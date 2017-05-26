var express = require('express');
var taskRouter = express.Router();
var taskService = require('../services/task');

taskRouter.post('/create',function(req,res,next){
	var taskObj = req.body;
  taskObj.created_date=new Date();
  taskObj.modified_date=new Date();
  console.log(taskObj);
  taskService.createNewTasks(taskObj, function(err, result) {
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

taskRouter.post('/list/:lesson_id',function(req,res,next){
var lesson_id=req.params.lesson_id;
taskService.getAllNewTasks(lesson_id,function(err, result){
  if (err) {
    console.log(err);
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

taskRouter.put('/update',function(req,res,next){
  var taskObj = req.body;
  taskService.updateTasks(taskObj, function(err, result) {
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


taskRouter.post('/quiz/createtask',function(req,res,next){
  var taskObj = req.body;
  taskService.createTasksQuiz(taskObj, function(err, result) {
      if (err) {
          console.log(err);
          res.status(500).send(err);
      } else {
          var object = {};
          object.status = 'success';
          object.result = result;
          res.status(201).send(object);
      }
  });
});

taskRouter.post('/reflection/createtask',function(req,res,next){
  var taskObj = req.body;
  taskService.createReflection(taskObj, function(err, result) {
      if (err) {
          res.status(500).send(err);
      } else {
          var object = {};
          object.status = 'success';
          object.result = result;
          res.status(201).send(object);
      }
  });
});

function createMaterialTask(taskObj, req, res, next) {
  taskService.createMaterialTask(taskObj, function(err, result) {
     console.log(err);
      if (err) {
          res.status(500).send(err);
      } else {
          var object = {};
          object.status = 'success';
          object.result = result;
          res.status(201).send(object);
      }
  });
}

taskRouter.post('/material/createtask',function(req,res,next){
  var taskObj = req.body;
  taskObj.can_embed = true;
  if(taskObj.type != 'Quiz' && taskObj.type != 'Editor' && taskObj.type != 'Reflection' && taskObj.url) {
    if(taskObj.url.indexOf('vimeo') === -1) {
      request(taskObj.url, function (error, response, body) {
          if (error) {
              createMaterialTask(taskObj, req, res, next);
          } else {
              var xFrameOptions = response.headers['x-frame-options'] || response.headers['X-Frame-Options'] || '';
              xFrameOptions = xFrameOptions.toLowerCase();
              if (xFrameOptions === 'sameorigin' || xFrameOptions === 'deny') {
                  taskObj.can_embed = false;
              }
              createMaterialTask(taskObj, req, res, next);
          }
      });  
    } else {
      createMaterialTask(taskObj, req, res, next);
    }
  } else {
    createMaterialTask(taskObj, req, res, next);
  }
});

taskRouter.post('/reflection/response',function(req,res,next){
  var taskObj = req.body;
  taskService.createUserReflection(taskObj, function(err, result) {
      if (err) {
          res.status(500).send(err);
      } else {
          var object = {};
          object.status = 'success';
          object.result = result;
          res.status(201).send(object);
      }
  });
});
taskRouter.get('/reflection/getReflectionDetails/:taskid',function(req,res,next){
  var task_id = req.params.taskid;
  taskService.getReflectionDetails(task_id, function(err, result) {
      if (err) {
          res.status(500).send(err);
      } else {
          var object = {};
          object.status = 'success';
          object.result = result;
          res.status(201).send(object);
      }
  });
});
taskRouter.put('/update/taskQuiz',function(req,res,next){
  var taskObj = req.body;
  taskService.updateQuizTasks(taskObj, function(err, result) {
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
taskRouter.put('/update/taskReflection',function(req,res,next){
  var taskObj = req.body;
  taskService.updateReflectionTasks(taskObj, function(err, result) {
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

module.exports = taskRouter;

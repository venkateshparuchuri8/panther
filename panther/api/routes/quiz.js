var express = require('express');
var quizRouter = express.Router();
var quizService = require('../services/quiz');


//get list of lessons for a class
quizRouter.get('/task/getquizdetails', function(req, res, next) {
    var task_id = req.query.task_id;
    quizService.getQuizDetails(task_id, function(err, result) {
        if (err) {
            res.status(500).send(err);
        } else {
            console.log(result);
            var object = {};
            object.status = 'success';
            object.result = result;
            res.status(200).send(object);
        }
    });
});

quizRouter.post('/savequizscores', function(req, res, next) {
    var quizObj = req.body;
    quizService.saveQuizDetails(quizObj, function(err, result) {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            var object = {};
            object.status = 'success';
            object.result = result;
            res.status(200).send(object);
        }
    });
});

quizRouter.get('/orglist/:organization_id', function(req, res, next) {
    var organization_id = req.params.organization_id;
    quizService.getAllQuizzes(organization_id, function(err, result) {
        if (err) {
            res.status(500).send(err);
        } else {
            var object = {};
            object.status = 'success';
            object.result = [];
            result = underscore.each(result, function(quiz){
                  var quiz_format = quiz;
                  quiz_format.options = JSON.parse(quiz.options);
              return quiz_format;
            });
            var quizzes = underscore.groupBy(result,"quiz_id");
            underscore.each(Object.keys(quizzes), function(quiz){
              var quiz_obj = {};
              quiz_obj.quiz_id = quiz;
              quiz_obj.material_id = quizzes[quiz][0].material_id;
              quiz_obj.questions = quizzes[quiz];
              object.result.push(quiz_obj);
            });
            res.status(200).send(object);
        }
    });
});

module.exports = quizRouter;

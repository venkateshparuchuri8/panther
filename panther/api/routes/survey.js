var express = require('express');
var surveyRouter = express.Router();
var surveyService = require('../services/survey');


//get list of surveys for an organization

surveyRouter.get('/list', function(req, res, next) {
    var organization_id = req.query.org_id;
    //console.log(organization_id);
    surveyService.getSurveyList(organization_id, function(err, result) {
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


//creation survey
surveyRouter.post('/create',function(req,res,next){
  var classObject = req.body;
  surveyService.createNewSurvey(classObject, function(err, result) {
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


surveyRouter.post('/delete',function(req,res,next){
  var classObject = req.body;
  surveyService.deleteSurvey(classObject, function(err, result) {
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

surveyRouter.put('/edit',function(req,res,next){
  var classObject = req.body;
  surveyService.editSurvey(classObject, function(err, result) {
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

surveyRouter.get('/surveydetails', function(req, res, next) {
    var survey_id = req.query.survey_id;
    surveyService.surveyDetails(survey_id, function(err, result) {
        console.log(err);
        console.log(result);
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

surveyRouter.put('/play',function(req,res,next){
  var surveyObject = req.body;
  surveyService.playPauseSurvey(surveyObject, function(err, result) {
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

surveyRouter.get('/checksurveystatus', function(req, res, next) {
    var user_id = req.query.user_id;
    surveyService.checksurveystatus(user_id, function(err, result) {
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

surveyRouter.post('/completesurvey',function(req,res,next){
  var surveyObject = req.body;
  surveyService.completeSurvey(surveyObject, function(err, result) {
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

module.exports = surveyRouter;

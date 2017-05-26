var express = require('express');
var organizationRouter = express.Router();
var organizationService = require('../services/organization');

organizationRouter.post('/create', function(req, res, next) {
	var orgObj=req.body;
	orgObj.created_date=new Date();
	orgObj.modified_date=new Date();
	orgObj.parent_id=201;
	orgObj.created_user=101;
	orgObj.modified_user=101;
    organizationService.createNewOrganization(orgObj, function(err, result) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(201).send(null, result);
        }
    })
});

organizationRouter.post('/getorgdetails', function(req, res, next) {
  var domain=req.body.domain;
  organizationService.getOrgDetails(domain,function(err, result){
    console.log(err);
    if (err) {
            res.status(500).send(err);
        } else {
            var object = {};
            object.status = 'success';
            object.result = result;
            res.status(200).send(object);
        }
  })
});

module.exports = organizationRouter;

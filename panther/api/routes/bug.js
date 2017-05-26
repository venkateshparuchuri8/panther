var express = require('express');
var bugRouter = express.Router();
var bugService = require('../services/bug');

bugRouter.get('/list/:organization_id', function(req, res, next) {
	var organization_id=req.params.organization_id;
	
	bugService.getAllBugs(organization_id, function(err, result){
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

bugRouter.put('/updateBug',function(req,res){
  var bugObj = req.body;
    bugService.updateBugs(bugObj, function(err, result) {
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


bugRouter.get('/list/:task_id', function(req, res) {
  var task_id=req.params.task_id;
  
  bugService.getBugs(task_id, function(err, result){
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

bugRouter.post('/createbug',function(req,res,next){
  var bugObj = req.body;
  bugService.createNewBug(bugObj, function(err, result) {
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
module.exports = bugRouter;

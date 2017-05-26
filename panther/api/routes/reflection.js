var express = require('express');
var reflectionRouter = express.Router();
var reflectionService = require('../services/reflection');

//get list of reflections in org
reflectionRouter.get('/orglist/:organization_id', function(req, res, next) {
    var organization_id = req.params.organization_id;
    reflectionService.getAllReflections(organization_id, function(err, result) {
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

module.exports = reflectionRouter;

var express = require('express');
var request = require('request');
var materialRouter = express.Router();
var materialService = require('../services/material');

materialRouter.post('/orglist/:organization_id', function(req, res) {
    var organization_id = req.params.organization_id;
    materialService.selectMaterials(organization_id, function(err, result) {
        if (err) {
            res.status(500).send(err);
        } else {
            var resData = {};
            resData.status = 'success';
            resData.result = result;
            res.status(200).send(resData);
        }
    });

});

function addMaterial(materialObj, req, res, next) {
    materialService.insertMaterialData(materialObj, function(err, result) {
        if (err) {
            res.status(500).send(err);
        } else {
            var obj = {};
            obj.status = 'succes';
            obj.result = result;
            res.status(200).send(obj);
        }
    });
}

materialRouter.post('/addmaterial', function(req, res, next) {
    var materialObj = req.body;
    materialObj.created_date = new Date();
    materialObj.modified_date = new Date();
    materialObj.can_embed = true;
    
    if(materialObj.url && materialObj.url.indexOf('vimeo') === -1) {
        request(materialObj.url, function (error, response, body) {
            if (error) {
                addMaterial(materialObj, req, res, next);
            } else {
                var xFrameOptions = response.headers['x-frame-options'] || response.headers['X-Frame-Options'] || '';
                xFrameOptions = xFrameOptions.toLowerCase();
                if (xFrameOptions === 'sameorigin' || xFrameOptions === 'deny') {
                    materialObj.can_embed = false;
                }
                addMaterial(materialObj, req, res, next);
            }
        });
    } else {
        addMaterial(materialObj, req, res, next);
    }
});

materialRouter.post('/updatedata', function(req, res, next) {
    var materialObject = req.body;
    materialService.updateMaterial(materialObject, function(err, rows) {
        if (err) {
            res.status(500).send(err);
        } else {
            var result = {};
            result.status = 'success';
            result.result = rows;
            res.status(200).send(result);
            //res.send(null, result);
        }
    });
});
materialRouter.post('/:material_id', function(req, res, next) {
    var material_id = req.params.material_id;
    materialService.getMaterial(material_id, function(err, result) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(result);
        }
    });
});


materialRouter.get('/user/completedMaterials/:user_id', function(req, res) {
    var user_id = req.params.user_id;
    materialService.getCompletedMaterials(user_id, function(err, result) {
        if (err) {
            res.status(500).send(err);
        } else {
            var obj = {};
            obj.status = 'success';
            obj.result = result;
            res.status(200).send(result);
        }
    });

});

module.exports = materialRouter;

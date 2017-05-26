var express = require('express');
var userRoute = express.Router();
var userService = require('../services/user');
var fs = require('fs');
var csv = require('fast-csv');
var json2csv = require('nice-json2csv');
var mime = require('mime');



userRoute.post('/login', function(req, res, next) {

    var userObj = req.body;


    userService.userLogin(userObj, function(err, result) {
        if (err) {
            res.status(500).send(err);
        } else {
            var obj = {};
            obj.status = 'success';
            if (result.length > 0) {
                obj.result = result[0];
            }
            res.status(200).send(obj);
        }
    });


});



userRoute.get('/userlist/:org_id', function(req, res) {
    var user_id = req.params.org_id;
    var _ = require('underscore-node');
    userService.selectAllUsers(user_id, function(err, result) {
        if (err) {
            res.status(500).send(err);
        } else {
            var resData = {};
            resData.status = 'success';
            resData.result = [];
            // _.each(result, function(object) {
            //     var geneder = [1, 0];
            //     object.gender = geneder[Math.floor(Math.random() * geneder.length)];
            //     var chapter = ["FLD", "ALC", "KTQ", "ART"]
            //     object.chapter = chapter[Math.floor(Math.random() * chapter.length)];
            //     object.points = _.random(1000000, 2000000);
            //     var city = ["Pheonix", "San Jose", "New Jersey", "Seattle", "Cleveland", "Charlotte"];
            //     object.city = city[Math.floor(Math.random() * city.length)];
            //     var state = ["California", "New York", "Ohio", "North Carolina", "Texas"];
            //     object.state = state[Math.floor(Math.random() * state.length)];
            //     resData.result.push(object);
            // });
            underscore.each(result, function(user) {
                var newUser = user;
                newUser.points = user.actions_points + user.task_points + user.lesson_points + user.class_points + user.survey_points + user.quiz_points;
                resData.result.push(newUser);
            });
            res.status(200).send(resData);
        }
    });

});

userRoute.post('/userlist/exports/', function(req, res, csv) {
    var filterlist = req.body.filter_list;
    //var userObj = req.body;\
    //console.log(filterlist.length);

    const justFirstNames = json2csv.convert(filterlist);

   // console.log(justFirstNames);
    //TODO: Need to do the research why var not working.
    const fileName = props.extracts_location + uuid.v4() + '.csv';
   // console.log(fileName);
    fs.writeFile(fileName, justFirstNames, function(err, result2) {
        //Insert Statement to the New Table With id, FileName
        userService.createNewExtracts(fileName, function(err, result) {
            if (err) {
                res.status(500).send(err);
            } else {
                var object = {};
                object.status = 'success';
                object.result = result;
                //res.send({ id: id });
                res.status(200).send(object);
            }
        });
    });

});

userRoute.get('/list/download/:id', function(req, res) {
    //Read the Database with the Id - Get the File Location.

    var extracts = req.params.id;
    var fileLocation = 'extracts';

    userService.getAllExtracts(extracts, function(err, result) {

        if (err) {
            res.status(500).send(err);
        } else {
             fileLocation = result[0].extracts_location;
             console.log(fileLocation);
            var object = {};
            object.status = 'success';
            var mimetype = mime.lookup('userdata.csv');
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-disposition', 'attachment;' + 'filename=userdata.csv');
           // res.setHeader('Content-type', mimetype);
            var readStream = fs.createReadStream(fileLocation);
            readStream.pipe(res);
        }
    });

});



userRoute.get('/userinfo', function(req, res) {
    var user_id = req.query.user_id;
    userService.userProfileInfo(user_id, function(err, result) {
        if (err) {
            res.status(500).send(err);
        } else {
            var resData = {};
            resData.status = 'success';
            resData.result = result[0];
            console.log(resData.result[0]);
            res.status(200).send(resData);
        }
    });
});

userRoute.get('/usercourseinfo', function(req, res) {
    var user_id = req.query.user_id;
    //var _ = require('underscore-node');
    userService.userCourseInfo(user_id, function(err, result) {
        if (err) {
            res.status(500).send(err);
        } else {
            var resData = {};
            resData.status = 'success';
            resData.result = result;
            // var courses = _.groupBy(result, "course_name");
            //  _.each(Object.keys(courses), function(course) {
            //    var courseObj = {};
            //    courseObj.course_name = course;
            //    courseObj.classes = _.filter(result, function(each_class){
            //          return each_class.course_name == course
            //    });
            //   _.each(courseObj.classes, function(class_obj){
            //       class_obj.lessons = _.filter(result, function(class_Object){
            //           return class_Object.class_name = class_obj.class_name
            //       });
            //   });
            //   resData.result.push(courseObj);
            //  });
            res.status(200).send(resData);
        }
    });
});


userRoute.get('/getPoints', function(req, res) {
    var organization_id = req.query.organization_id;
    userService.getUserPoints(organization_id, function(err, result) {
        if (err) {
            res.status(500).send(err);
        } else {
            var object = {};
            object.status = 'success';
            object.result = [];
            if (result.length > 0) {
                var overallresult = [];
                underscore.each(result, function(user) {
                    var newUser = user;
                    newUser.total_points = user.actions_points + user.task_points + user.lesson_points + user.class_points + user.survey_points + user.quiz_points;
                    overallresult.push(newUser);
                });
                object.result = overallresult;
            }
            res.status(200).send(object);
        }
    });
});

userRoute.get('/ribbons/list/:user_id', function(req, res) {
    var user_id = req.params.user_id;
    userService.getRibbons(user_id, function(err, result) {
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


module.exports = userRoute;

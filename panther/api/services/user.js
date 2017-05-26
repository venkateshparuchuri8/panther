exports.userLogin = function(userObj, callback) {
    console.log(userObj);
    excuteQuery.queryForAll(sqlQueryMap['userLogin'], [userObj.email, userObj.password], function(err, result) {
        console.log(err);
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    });
};

exports.selectAllUsers = function(user_id, callback) {
    excuteQuery.queryForAll(sqlQueryMap['listofUsers'], [user_id], function(err, result) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    })
};


exports.exportAllUsers = function(org_id, callback) {
    excuteQuery.queryForAll(sqlQueryMap['listofUsers'], [org_id], function(err, result) {
        console.log(result);
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    })
};

exports.getRibbons = function(user_id, callback) {
    excuteQuery.queryForAll(sqlQueryMap['getUserRibbons'], [user_id,user_id], function(err, result) {
        console.log(result);
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    })
};

exports.userProfileInfo = function(user_id, callback) {
    excuteQuery.queryForAll(sqlQueryMap['userProfileInfo'], [user_id, user_id], function(err, result) {
        console.log(result);
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    })
};
exports.userCourseInfo = function(user_id, callback) {
    //userCourseInfo
    var _ = require('underscore-node');
    excuteQuery.queryForAll(sqlQueryMap['userCourseList'], [user_id], function(err, result) {
        if (err) {
            callback(err, null);
        } else {
            //getting all the courses for this user(org id)
            async.map(result, function(course, eachCallback) {
                //for each course get the classes
                excuteQuery.queryForAll(sqlQueryMap['courseSpecificclassList'], [user_id, course.course_id, user_id,course.course_id], function(err, courseClasses) {
                    if (err) {
                        eachCallback(err, null);
                    } else {
                        excuteQuery.queryForAll(sqlQueryMap['userCourseInfo'], [user_id, user_id, user_id], function(err, allResults) {
                            var newResult = [];
                            _.each(courseClasses, function(classObj) {
                                if (course.is_supplemental == 'yes') {
                                    //if the course is supplemental
                                    var courseGroup = _.groupBy(allResults, "class_id");
                                    classObj.lessons = _.uniq(courseGroup[classObj.class_id], function(lesson) { return lesson.lesson_id });
                                    if(classObj.class_status == 'locked'){
                                      classObj.class_status = 'unlocked';
                                    }
                                    //var statusGroup = _.groupBy(classObj.lessons, "task_status");
                                    // if (Object.keys(statusGroup).indexOf('started') != -1) {
                                    //     classObj.class_status = 'started';
                                    // } else if (Object.keys(statusGroup).indexOf('locked') != -1) {
                                    //     classObj.class_status = 'unlocked';
                                    // } else {
                                    //     classObj.class_status = 'completed';
                                    // }
                                } else {
                                    //if the course is not supplemental
                                    var courseGroup = _.groupBy(allResults, "class_id");
                                    classObj.lessons = _.uniq(courseGroup[classObj.class_id], function(lesson) { return lesson.lesson_id });
                                    // var statusGroup = _.groupBy(classObj.lessons, "task_status");
                                    // if (Object.keys(statusGroup).indexOf('started') != -1) {
                                    //     classObj.class_status = 'started';
                                    // } else if (Object.keys(statusGroup).indexOf('locked') != -1) {
                                    //     classObj.class_status = 'locked';
                                    // } else {
                                    //     classObj.class_status = 'completed';
                                    // }
                                }
                                newResult.push(classObj);
                            });
                            if(course.is_supplemental != 'yes'){
                                if(newResult[0].class_status == 'locked'){
                                    newResult[0].class_status='unlocked'
                                }
                            }

                            course.classes = newResult;

                            var groupedClasses = _.groupBy(course.classes, function(cls) { return cls.class_published_status; });
                            groupedClasses[0] = _.sortBy(groupedClasses[0], function(cls) {return cls.class_id });
                            groupedClasses[1] = _.sortBy(groupedClasses[1], function(cls) {return cls.class_id });
                            groupedClasses = [].concat(groupedClasses[1]).concat(groupedClasses[0]);
                            course.classes = _.map(groupedClasses, function(cls, key) {
                                cls.order = key + 1;
                                cls.lessons = _.map(cls.lessons, function(les, lessonKey) {
                                    les.order = lessonKey + 1;
                                    return les;
                                });
                                return cls;
                            });
                            //console.log(course.classes);
                            eachCallback(null, course);
                        });

                    }
                })
            }, function(err, mapresults) {
                if (err) {
                    callback(err, null);
                } else {
                    //var object = {};
                    //object.result = mapresults;
                    callback(null, mapresults);

                }
            });
        }
    })
};



exports.getUserPoints = function(organization_id, callback) {
    excuteQuery.queryForAll(sqlQueryMap['listofUserPoints'], [organization_id], function(err, result) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    })
};


exports.createNewExtracts = function(fileName,callback){
    excuteQuery.insertAndReturnKey(sqlQueryMap['createNewExtracts'], [fileName], function(err, result) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    });
}

exports.getAllExtracts = function(extracts, callback) {
    excuteQuery.queryForAll(sqlQueryMap['listofextracts'], [extracts], function(err, result) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    })
};

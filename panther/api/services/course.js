exports.getAllCourses = function(org_id, callback) {
    excuteQuery.queryForAll(sqlQueryMap['course_list'], [org_id], function(err, result) {
        if (err) {
            callback(err, null);
        } else {
            async.map(result, function(obj, eachCallback) {
                excuteQuery.queryForAll(sqlQueryMap['course_ribbons_list'], [obj.id], function(err, result1) {
                    if (err) {
                        eachCallback(err, null);
                    } else {

                        obj.ribbons = result1;
                        eachCallback(null, obj);
                    }
                })
            }, function(err, mapresults) {
                if (err) {
                    callback(err, null);
                } else {
                    var object = {};
                    object.success = 'result';
                    object.result = mapresults;
                    callback(null, object);
                }
            });
        }
    })
}


exports.createNewCourse = function(courseObject, callback) {
    var ribbons = courseObject.ribbons;
    delete courseObject.ribbons;
    excuteQuery.queryForAll(sqlQueryMap['createNewCourse'], [courseObject], function(err, result) {
        console.log(err);
        if (err) {
            callback(err, null);
        } else {
            courseObject.id = result.insertId;
            if (ribbons && ribbons.length > 0) {
                courseObject.ribbons = ribbons;
                courseRibbons(courseObject, callback);
            } else {
                getCreateAndUpdatedCourse(courseObject.id, callback);
            }
        }
    })
}

exports.editCourseDetails = function(courseId, callback) {
    excuteQuery.queryForAll(sqlQueryMap['editCourseDetails'], [courseId], function(err, result) {
        if (err) {
            callback(err, null);
        } else {
            var obj = {};
            obj.success = 'result';
            obj.result = result[0];
            callback(null, obj);
        }
    });
}


function courseRibbons(courseObject, callback) {
    async.each(courseObject.ribbons, function(url, eachCallback) {
        var obj = {};
        obj.ribbon_url = url;
        obj.course_id = courseObject.id;
        obj.created_date = new Date();
        obj.modified_date = new Date();
        obj.created_user = courseObject.created_user;
        obj.modified_user = courseObject.created_user;
        excuteQuery.queryForAll(sqlQueryMap['courseRibbonsInsert'], [obj], function(err, result) {
            console.log(err);
            if (err) {
                eachCallback(err, null);
            } else {
                var obj = {};
                obj.success = 'result';
                obj.result = result;
                console.log(obj);
                eachCallback(null, obj);
            }
        })
    }, function(err, results) {
        if (err) {
            callback(err, null);
        } else {
            var obj = {};
            obj.success = 'result';
            obj.result = results;
            //callback(null, results);
            getCreateAndUpdatedCourse(courseObject.id, callback);
        }
    });
}

function getCreateAndUpdatedCourse(course_id, callback) {
    excuteQuery.queryForAll(sqlQueryMap['createCourseList'], [course_id], function(err, courseResult) {
        if (err) {
            callback(err, null);
        } else {
            var obj = {};
            obj.status = 'success';
            obj.result = courseResult[0];
            excuteQuery.queryForAll(sqlQueryMap['course_ribbons_list'], [obj.result.id], function(err, ribbons) {
                if (err) {
                    callback(err, null);
                } else {
                    obj.result.ribbons = ribbons;
                    callback(null, obj);
                }
            });
            //callback(null, obj);
        }
    });
}

exports.updateCourse = function(courseObject, callback) {
    var ribbons = courseObject.ribbons;
    delete courseObject.ribbons;
    console.log(courseObject);
    excuteQuery.update(sqlQueryMap['updateCourse'], [courseObject.name, courseObject.description, courseObject.is_supplemental, courseObject.modified_date, courseObject.id], function(err, result) {
        if (err) {
            callback(err, null);
        } else {
            if (ribbons && ribbons.length > 0) {
                courseObject.ribbons = ribbons;
                courseRibbons(courseObject, callback);
            } else {
                getCreateAndUpdatedCourse(courseObject.id, callback);
            }
        }
    })
}

exports.getCourseDetails = function(course_id, callback) {
    excuteQuery.queryForAll(sqlQueryMap['courseDetails'], [course_id], function(err, result) {
        if (err) {
            callback(err, null);
        } else {
            var obj = {};
            obj.success = 'result';
            obj.result = result[0];
            excuteQuery.queryForAll(sqlQueryMap['classRibbons'], [obj.result.id, obj.result.id], function(err, ribbons) {
                if (err) {
                    callback(err, null);
                } else {
                    obj.result.ribbonsAvailable = ribbons;
                    excuteQuery.queryForAll(sqlQueryMap['course_ribbons_list'], [obj.result.id], function(err, ribbons1) {
                        if (err) {
                            callback(err, null);
                        } else {
                            obj.result.ribbons = ribbons1;
                            callback(err, result);
                        }
                    });
                }
            });

        }
    })
}


// function getAllCourses(org_id, callback) {
//     excuteQuery.queryForAll(sqlQueryMap['course_list'], [org_id], function(err, result) {
//         if (err) {
//             callback(err, null);
//         } else {
//             var obj = {};
//             obj.data = result;
//             callback(null, obj);
//         }
//     })
// }

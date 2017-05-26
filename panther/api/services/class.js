exports.checkRibbonAvailability = function(ribbonId, callback) {
    excuteQuery.queryForAll(sqlQueryMap['checkRibbonAvailability'], [ribbonId], function(err, result) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    });
};


exports.classList = function(course_id, callback) {
    getAllClassesOfCourse(course_id, callback);
};

exports.getClassDetails=function(classid,callback){
    excuteQuery.queryForAll(sqlQueryMap['getClassDetails'], [classid], function(err, result) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    });
}


exports.createNewClass = function(classObject, callback) {
  excuteQuery.queryForAll(sqlQueryMap['classSortOrder'], [classObject.course_id], function(err, result) {
      if (err) {
          callback(err, null);
      } else {
        console.log(result);
          if (result.length > 0){
            classObject.sort_order = parseInt(result[0].sort_order) + 1;
          }else{
            classObject.sort_order = 1;
          }
          console.log(classObject);
          insertIntoClass(classObject, callback);
      }
  });
};

function insertIntoClass(classObject, callback){
  excuteQuery.insertAndReturnKey(sqlQueryMap['createNewClass'], [classObject.name, classObject.description, classObject.course_ribbon_id, classObject.hero_image,
      100,classObject.video_url, "drafted", classObject.course_id,classObject.sort_order, classObject.created_user, classObject.created_user
  ], function(err, result) {
      console.log(err);
      if (err) {
          callback(err, null);
      } else {
          getAllClassesOfCourse(classObject.course_id, callback);
      }
  });
}

exports.updateClass = function(classObject, callback) {
    console.log(classObject);
    excuteQuery.update(sqlQueryMap['updateClass'], [classObject.name, classObject.description,classObject.course_ribbon_id, classObject.hero_image,
        100,classObject.video_url,classObject.status, classObject.created_user, classObject.id
    ], function(err, result) {
        console.log(err);
        if (err) {
            callback(err, null);
        } else {
            getAllClassesOfCourse(classObject.course_id, callback)
        }
    });
};

exports.publishClass = function(class_id,course_id, callback) {
    excuteQuery.update(sqlQueryMap['updateClassStatus'], ['published',class_id], function(err, result) {
        if (err) {
            callback(err, null);
        } else {
            getAllClassesOfCourse(course_id, callback);
        }
    });
}

exports.draftClass = function(class_id,course_id, callback) {
    excuteQuery.update(sqlQueryMap['updateClassStatus'], ['drafted',class_id], function(err, result) {
        if (err) {
            callback(err, null);
        } else {
            getAllClassesOfCourse(course_id, callback);
        }
    });
}

function getAllClassesOfCourse(course_id, callback) {
    console.log(course_id)
    excuteQuery.queryForAll(sqlQueryMap['classList'], [course_id], function(err, result) {
        if (err) {
            callback(err, null);
        } else {
            var obj={};
            if(result && result.length > 0){
                obj.draftedClasses=underscore.where(result, {status: "drafted"});
                obj.publishedClasses=underscore.where(result, {status: "published"});
                callback(null, obj);
            }else{
                callback(null, obj);
            }
        }
    });
}

exports.classRibbons = function(course_id, callback) {
    console.log(course_id, course_id);
    excuteQuery.queryForAll(sqlQueryMap['classRibbons'], [course_id, course_id], function(err, result) {
        if (err) {
            callback(err, null);
        } else {
            console.log(result);
            callback(err, result);
        }
    });
}

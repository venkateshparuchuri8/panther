exports.lessonList = function(class_id,callback){
    getAllLessonsOfClass(class_id, callback);
};

exports.createNewLesson = function(lessonObject,callback){
  excuteQuery.queryForAll(sqlQueryMap['lessonsSortOrder'], [lessonObject.class_id], function(err, result) {
      if (err) {
          callback(err, null);
      } else {
          if (result.length >0){
            lessonObject.sort_order = result[0].sort_order + 1 ;
          } else{
            lessonObject.sort_order = 1;
          }
        insertIntoLesson(lessonObject, callback);
      }
  });
};

function insertIntoLesson(lessonObject, callback){
  excuteQuery.insertAndReturnKey(sqlQueryMap['createNewLesson'], [lessonObject.name, lessonObject.description,
    lessonObject.hero_image, 100,lessonObject.class_id, lessonObject.sort_order, lessonObject.created_user, lessonObject.modified_user], function(err, result) {
      console.log(err);
      if (err) {
          callback(err, null);
      } else {
          console.log(result);
          getAllLessonsOfClass(lessonObject.class_id, callback);
      }
  });
}
exports.getLessonDetails=function(lessonId,callback){
    excuteQuery.queryForAll(sqlQueryMap['getLessonDetails'], [lessonId,lessonId,lessonId,lessonId], function(err, result) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    });
}

exports.publishLesson = function(lesson_id,class_id, callback) {
    excuteQuery.update(sqlQueryMap['updateLessonStatus'], ['published',lesson_id], function(err, result) {
        if (err) {
            callback(err, null);
        } else {
            getAllLessonsOfClass(class_id, callback);
        }
    });
}

exports.updateLesson = function(lessonObject, callback) {
    console.log(lessonObject);
    excuteQuery.update(sqlQueryMap['updateLesson'], [lessonObject.name, lessonObject.description, lessonObject.hero_image,
        100, lessonObject.created_user, lessonObject.id
    ], function(err, result) {
        console.log(err);
        if (err) {
            callback(err, null);
        } else {
            getAllLessonsOfClass(lessonObject.class_id, callback)
        }
    });
};

function getAllLessonsOfClass(class_id, callback) {
    excuteQuery.queryForAll(sqlQueryMap['lessonList'], [class_id], function(err, result) {
        if (err) {
            callback(err, null);
        } else {
            var obj={};
            obj=result;
            callback(null, obj);
            // if(result && result.length > 0){
            //     obj.draftedLessons=underscore.where(result, {status: "drafted"});
            //     obj.publishedLessons=underscore.where(result, {status: "published"});
            //     callback(null, obj);
            // }else{
            //     callback(null, obj);
            // }
        }
    });
}

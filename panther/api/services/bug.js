    exports.getAllBugs = function (organization_id, callback) {
    excuteQuery.queryForAll(sqlQueryMap['buglist'], [organization_id], function(err, result) {
        if (err) {
            callback(err, null);
             } else {
            callback(null, result);
          
        }
    });
};

exports.updateBugs = function(bugObj, callback){
        excuteQuery.update(sqlQueryMap['updateBugs'], [bugObj.status, bugObj.id], function(err, result) {
        if (err) {
              callback(err, null);
        } else {
           excuteQuery.queryForAll(sqlQueryMap['updatedBugResult'], [bugObj.id], function(err, bugResult) {
              if(err){
                callback(err, null);
              }else{
                if(bugResult.length > 0){
                  callback(null, bugResult[0]);
                }
              }
           });            
        }
    });
}



function insertIntoBug(bugObj, callback){
  excuteQuery.insertAndReturnKey(sqlQueryMap['createNewBug'], [bugObj.course_id, bugObj.class_id, bugObj.lesson_id, bugObj.task_id,
    bugObj.action_id, 'unresolved',bugObj.user_id,bugObj.user_id, bugObj.description], function(err, result) {
      console.log(bugObj);
      console.log(err);
      if (err) {
          callback(err, null);
      } else {
        callback(null, result);
      }
  });
}

exports.createNewBug = function(bugObj, callback){
    excuteQuery.queryForAll(sqlQueryMap['getTaskLessonDetails'], [bugObj.task_id], function(err, result) {
      if (err) {
          callback(err, null);
      } else {
        if(result.length > 0){
            bugObj.lesson_id  = result[0].lesson_id;
            bugObj.class_id = result[0].class_id;
            bugObj.course_id = result[0].course_id;
            insertIntoBug(bugObj, callback);
        }
      }
    });

}


exports.getQuizDetails = function(task_id,callback){
  excuteQuery.queryForAll(sqlQueryMap['getQuizDetails'], [task_id], function(err, result) {
      if (err) {
          callback(err, null);
      } else {
            callback(null, result);
      }
  });
};

exports.saveQuizDetails = function(quizObj,callback){
  excuteQuery.insertAndReturnKey(sqlQueryMap['saveQuizDetails'], [quizObj.user_id, quizObj.quiz_id, 'completed', quizObj.score], function(err, result) {
      if (err) {
          callback(err, null);
      } else {
            callback(null, result);
      }
  });
};


exports.getAllQuizzes = function(org_id, callback) {
    excuteQuery.queryForAll(sqlQueryMap['OrgQuizzes'], [org_id], function(err, result) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    })
};

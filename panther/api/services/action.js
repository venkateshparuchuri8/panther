exports.createNewActions = function(actionObj,callback){
	console.log(actionObj);
	excuteQuery.insertAndReturnKey(sqlQueryMap['createNewAction'], [actionObj], function(err, result) {
        console.log(err);
        if (err) {
            callback(err, null);
        } else {
            getAllActions(actionObj.lesson_id, callback);
        }
    });
}
exports.updateActions = function(actionObj,callback){
    console.log(actionObj);
    excuteQuery.insertAndReturnKey(sqlQueryMap['updateAction'], [actionObj.description,actionObj.modified_user,actionObj.modified_date,actionObj.id], function(err, result) {
        console.log(err);
        if (err) {
            callback(err, null);
        } else {
            getAllActions(actionObj.lesson_id, callback);
        }
    });
}

exports.getAllNewActions = function(lesson_id,callback){
    getAllActions(lesson_id, callback);
}

function getAllActions(lesson_id,callback){
   excuteQuery.queryForAll(sqlQueryMap['getAllActions'], [lesson_id], function(err, result) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    });
}
exports.getAllUserActions = function(user_id,callback){
    getActions(user_id,callback);
}
exports.updateAction = function(userObj,callback){
    excuteQuery.update(sqlQueryMap['updateUserActions'],[userObj.modified_user,userObj.action_response,userObj.user_id,userObj.action_id,],function(err,result){
        if(err){
            callback(err,null);
        }else{
            completeCurrentLesson(userObj);
            sendNotificationForAction(userObj);
            getActions(userObj.user_id,callback);
        }
    });
}

function getActions(user_id,callback){
    excuteQuery.queryForAll(sqlQueryMap['getAllUserActions'],[user_id],function(err,result){
        if(err){
            callback(err, null);
        }else{
            callback(null,result);
        }
    });
}

function sendNotificationForAction(actionObj,callback){
    excuteQuery.queryForAll(sqlQueryMap['actionNotifications'], [actionObj.user_id,  actionObj.action_id], function(err, result1) {
        console.log(err);
        if (err) {
            eachCallback(err, null);
        } else {

            var resultObj = result1[0];
            resultObj.type="actionNotifications";
            var description='';
            description='<span class="name"><a href="/user/userleadinfo/"'+actionObj.user_id+'> '+resultObj.user_name+'</span> finished an action and earned <b>'+resultObj.points+'</b>'
            excuteQuery.insertAndReturnKey(sqlQueryMap['insertNotifications'], [resultObj.organization_id, actionObj.user_id, description , actionObj.user_id], function(err, result) {
                if (err) {
                    console.log(err);
                } else {
                    resultObj.notification_id=result;
                    io.emit(resultObj.organization_id, { 'data': resultObj });
                }
            });


        }
    })
}

exports.completeCurrentLessonInMember = function(userObj){
    completeCurrentLesson(userObj);
}

function completeCurrentLesson(userObj){
  console.log("I am a complete lesson Obj");
  console.log(userObj);
  excuteQuery.update(sqlQueryMap['updateCurrentLesson'],[userObj.user_id, userObj.user_id, userObj.lesson_id],function(err,result){
      if(err){
        console.log(err);
          //callback(err, null);
      }else{
        console.log("Current Lesson updated to complete");
        if(result > 0){
            excuteQuery.queryForAll(sqlQueryMap['verifyClassComplete'],[userObj.user_id, userObj.class_id],function(err,lessonStatus){
                if(err){
                    console.log(err);
                }else{
                    console.log(lessonStatus);
                    var classUpdate = true;
                    if(underscore.find(lessonStatus, {"lesson_status": "locked"})){
                      classUpdate = false;
                    }else if(underscore.find(lessonStatus, {"lesson_status": "started"})){
                      classUpdate = false
                    }
                    console.log(classUpdate);
                    if(classUpdate){
                      excuteQuery.update(sqlQueryMap['updateCurrentUserClass'],['completed', userObj.user_id, userObj.user_id, userObj.class_id],function(err,updateClass){
                            if(err){
                              console.log(err);
                            }else{
                              var notifyObj = {};
                              notifyObj.user_id = userObj.user_id;
                              notifyObj.class_id = userObj.class_id;
                              sendNotificationForClass(notifyObj)
                              console.log("Updating Class to Complete")
                            }
                      });
                    }
                }
            });
        }
      }
  });
}

function sendNotificationForClass(notifyObj) {
    excuteQuery.queryForAll(sqlQueryMap['classStatusNotificaton'], [notifyObj.user_id, notifyObj.user_id, notifyObj.class_id], function(err, result1) {
        if (err) {
            eachCallback(err, null);
        } else {

            var resultObj = result1[0];
            resultObj.type="classNotifications";
            var description='';
            description='<span class="name"><a href="/user/userleadinfo/"'+notifyObj.user_id+'> '+resultObj.user_name+'</span> '+resultObj.status +' the class <b>'+resultObj.class_name+'</b>'
            excuteQuery.insertAndReturnKey(sqlQueryMap['insertNotifications'], [resultObj.organization_id, notifyObj.user_id, description , notifyObj.user_id], function(err, result) {
                if (err) {
                    console.log(err);
                } else {
                    resultObj.notification_id=result;
                    io.emit(resultObj.organization_id, { 'data': resultObj });
                }
            });


        }
    })
}

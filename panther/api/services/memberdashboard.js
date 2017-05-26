var actionService = require('../services/action');
exports.getUserCourses = function(callback) {
    excuteQuery.queryForAll(sqlQueryMap['getAllUserCourses'], function(err, result) {
        console.log(err);
        if (err) {
            callback(err, null);
        } else {
            async.map(result, function(obj, eachCallback) {
                excuteQuery.queryForAll(sqlQueryMap['courseClassList'], [obj.id], function(err, result1) {
                    console.log(err);
                    if (err) {
                        eachCallback(err, null);
                    } else {

                        obj.classes = result1;
                        eachCallback(null, obj);
                    }
                })
            }, function(err, mapresults) {
                console.log(err);
                if (err) {
                    callback(err, null);
                } else {
                    callback(null, mapresults);
                }
            });
        }
    });
}

exports.getUserClassDetails = function(class_id, user_id, callback) {
    excuteQuery.queryForAll(sqlQueryMap['getClassPageDetails'], [user_id, class_id], function(err, result) {
        if (err) {
            callback(err, null);
        } else {
            //callback(null, result);
            var obj = {};
            obj.result = result[0];
            obj.result.lessons = [];
            excuteQuery.queryForAll(sqlQueryMap['getClassPageLessons'], [user_id, user_id, user_id, class_id], function(err, result1) {
                if (err) {
                    callback(err, null);
                } else {
                    if (result.length > 0) {
                        // obj.result.lessons = result1;
                        // We are unlocking the first task for every user by default ////
                        
                        if (result1[0].task_order == 1 && result1[0].task_status == 'locked') {
                            result1[0].task_status = 'started';
                        }

                        var lessonsGroup = underscore.groupBy(result1, 'lesson_id');
                        underscore.each(Object.keys(lessonsGroup), function(less) {
                          var lessonObj = {};
                          lessonObj.lesson_id = lessonsGroup[less][0].lesson_id;
                          lessonObj.lesson_name = lessonsGroup[less][0].lesson_name;
                          lessonObj.lesson_order = lessonsGroup[less][0].lesson_order;
                          lessonObj.lesson_total_points = lessonsGroup[less][0].lesson_total_points;
                          lessonObj.action_id = lessonsGroup[less][0].action_id;
                          lessonObj.action_status = lessonsGroup[less][0].action_status;
                          lessonObj.action_description = lessonsGroup[less][0].action_description;
                          lessonObj.lesson_description = lessonsGroup[less][0].lesson_description;
                          lessonObj.lesson_order=lessonsGroup[less][0].lesson_order;
                          lessonObj.lesson_status = lessonsGroup[less][0].lesson_status;
                          if(lessonObj.lesson_order == 1 && lessonObj.lesson_status == 'locked'){
                            lessonObj.lesson_status = 'started';
                          }
                          // var statuGroup = underscore.groupBy(lessonsGroup[less], "task_status");
                          // if (Object.keys(statuGroup).indexOf('started') != -1) {
                          //     lessonObj.lesson_status = 'started';
                          // } else if (Object.keys(statuGroup).indexOf('locked') != -1) {
                          //     lessonObj.lesson_status = 'locked';
                          // } else {
                          //     lessonObj.lesson_status = 'completed';
                          // }
                          lessonObj.tasks = lessonsGroup[less];

                          obj.result.lessons.push(lessonObj);
                        });

                        callback(null, obj.result);
                    }
                }
            });
        }
    });
}

exports.getNotificatonList = function(notifyObj, callback) {
    //console.log(notifyObj);
    excuteQuery.queryForAll(sqlQueryMap['getNotificationsList'], [notifyObj.user_id, notifyObj.user_id,notifyObj.user_id], function(err, result) {
        if (err) {
            callback(err, null);
        } else {
            console.log(result);
            callback(null, result);
        }
    });
}

exports.updateNotificationStatus = function(notifyObj, callback) {
    //console.log(notifyObj);
    excuteQuery.insertAndReturnKey(sqlQueryMap['updateNotificationStatus'], [notifyObj.notification_id, notifyObj.user_id], function(err, result) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    });
}

exports.bookmarking = function(bookmarkObj, callback) {
    excuteQuery.update(sqlQueryMap['updateBookmarkingStatus'], [bookmarkObj.bookmarked, bookmarkObj.user_id, bookmarkObj.task_id], function(err, result) {
        if (err) {
            callback(err, null);
        } else {
          excuteQuery.queryForAll(sqlQueryMap['UserCompletedMaterials'], [bookmarkObj.user_id], function(err, materialResult) {
              //console.log(result);
              if (err) {
                  callback(err, null);
              } else {
                  callback(null, materialResult);
              }
          });
        }
    });
}


exports.taskComplete = function(taskObj, callback) {
    taskObj.created_date = new Date();
    taskObj.modified_date = new Date();
    taskObj.created_user = taskObj.user_id;
    taskObj.modified_user = taskObj.user_id;
    taskObj.completion_date = new Date();
    taskObj.bookmarked = taskObj.bookmarked;
    
    excuteQuery.update(sqlQueryMap['updateTaskComplete'], [taskObj.status, taskObj.bookmarked, taskObj.user_id, taskObj.user_id, taskObj.task_id], function(err, result) {
        if (err) {
            callback(err, null);
        } else {
            if (taskObj.nextTaskId || taskObj.action_id || taskObj.lesson_id || taskObj.nextLessonId || taskObj.lessonCompleteId) {
                if (taskObj.action_id) {
                    insertUnlockedAction(taskObj);
                }
                if (taskObj.nextTaskId) {
                    insertNextTask(taskObj);
                }
                if (taskObj.nextLessonId || taskObj.lesson_id) {
                    unlockNextLesson(taskObj);
                }
                if(taskObj.lessonCompleteId){
                  taskObj.lesson_id = taskObj.lessonCompleteId;
                  actionService.completeCurrentLessonInMember(taskObj);
                }
            }
            if (result > 0) {
                callback(null, result);
            } else {
                insertCurrentTask(taskObj, callback);
            }

        }
    });
}


function insertCurrentTask(taskObj, callback){

  excuteQuery.insertAndReturnKey(sqlQueryMap['insertTaskComplete'], [taskObj.user_id, taskObj.task_id, 'completed', taskObj.bookmarked, taskObj.user_id, taskObj.user_id], function(err, result) {
      if (err) {
          callback(err, null);
      } else {

        callback(null, result);
      }
  });
}


function insertNextTask(taskObj){
  taskObj.bookmarked = 0;
  excuteQuery.insertAndReturnKey(sqlQueryMap['insertTaskComplete'], [taskObj.user_id, taskObj.nextTaskId, 'started', taskObj.bookmarked, taskObj.user_id, taskObj.user_id], function(err, result) {
      if (err) {
          console.log(err);
      } else {

          console.log(result);
      }
  });
}

function insertUnlockedAction(taskObj){
  excuteQuery.insertAndReturnKey(sqlQueryMap['insertUnlockedAction'], [taskObj.user_id, taskObj.action_id, 'started', taskObj.user_id, taskObj.user_id], function(err, result) {
      if (err) {
          console.log(err);
      } else {
          console.log(result);
      }
  });
}


function unlockNextLesson(taskObj){
  if(taskObj.lesson_id){
    excuteQuery.insertAndReturnKey(sqlQueryMap['unlockNextLesson'], [taskObj.user_id, taskObj.lesson_id, 'started', taskObj.user_id, taskObj.user_id], function(err, result) {
        if (err) {
            console.log(err);
        } else {
          excuteQuery.insertAndReturnKey(sqlQueryMap['unlockCurrentClass'], [taskObj.user_id, taskObj.lesson_id, 'started', taskObj.user_id, taskObj.user_id], function(err, classUpdate) {
              if(err){
                console.log(err);
              }else{
                var notifyObj = {};
                notifyObj.user_id = taskObj.user_id;
                notifyObj.class_id = taskObj.class_id;
                notifyObj.status='started';
                sendNotificationForClass(notifyObj);
                console.log(classUpdate);
              }
          });
        }
    });
  }
  if(taskObj.nextLessonId){
    excuteQuery.insertAndReturnKey(sqlQueryMap['unlockNextLesson'], [taskObj.user_id, taskObj.nextLessonId, 'started', taskObj.user_id, taskObj.user_id], function(err, result) {
        if (err) {
            console.log(err);
        } else {
        //   io.emit('room', {
        // data: {'name':'yamini'}
        // });
          console.log(result);
        }
    });
  }
}

function sendNotificationForClass(notifyObj) {
    excuteQuery.queryForAll(sqlQueryMap['classStatusNotificaton'], [notifyObj.user_id, notifyObj.user_id, notifyObj.class_id], function(err, result1) {
        if (err) {
            eachCallback(err, null);
        } else {

            var resultObj = result1[0];
            resultObj.type = "classNotifications";
            var description='';//
            description='<span class="name"><a href="/user/userleadinfo/"'+notifyObj.user_id+'> '+resultObj.user_name+'</a></span> '+notifyObj.status +' the class <b>'+resultObj.class_name+'</b>'
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

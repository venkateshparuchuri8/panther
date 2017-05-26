exports.createNewTasks = function(taskObj,callback){
  excuteQuery.queryForAll(sqlQueryMap['taskSortOrder'], [taskObj.lesson_id], function(err, result) {
    if(err){
      console.log(err);
      callback(err, null);
    }else{
      if (result.length >0){
        taskObj.sort_order = result[0].sort_order + 1 ;
      } else{
        taskObj.sort_order = 1;
      }
    insertIntoTask(taskObj, callback);
    }
  });
}

function insertIntoTask(taskObj, callback){
  excuteQuery.insertAndReturnKey(sqlQueryMap['createNewTask'], [taskObj.title, taskObj.description, taskObj.points, taskObj.material_id,
    taskObj.lesson_id, taskObj.sort_order, taskObj.created_user, taskObj.created_user], function(err, result) {
        if (err) {
            callback(err, null);
        } else {
            getAllTasks(taskObj.lesson_id, callback);
        }
    });
}

exports.getAllNewTasks = function(lesson_id,callback){
    getAllTasks(lesson_id, callback);
}

exports.updateTasks = function(taskObj,callback){
    excuteQuery.update(sqlQueryMap['updateTask'], [taskObj.task_title,taskObj.task_description, taskObj.user_id,taskObj.task_id], function(err, result) {
        if (err) {
            callback(err, null);
        } else {
           editTaskMaterial(taskObj, callback);
        }
    });
}

function editTaskMaterial(taskObj, callback){
 excuteQuery.update(sqlQueryMap['updateTaskMaterial'],
    [taskObj.material_title, taskObj.hero_image, taskObj.estimated_time,  taskObj.author, taskObj.user_id, taskObj.content,taskObj.material_id ], function(err, result) {
      if (err) {
          callback(err, null);
      } else {
          getAllTasks(taskObj.lesson_id, callback);
      }
  });
}

function getAllTasks(lesson_id,callback){
   excuteQuery.queryForAll(sqlQueryMap['getAllTasks'], [lesson_id], function(err, result) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    });
}


exports.createTasksQuiz = function(taskObj,callback){
  excuteQuery.insertAndReturnKey(sqlQueryMap['createQuiz'], [taskObj.lesson_id], function(err, result) {
      if (err) {
          callback(err, null);
      } else {
            if (result > 0){
                taskObj.quiz_id = result;
                //console.log(taskObj);
                creatQuizQuestions(taskObj, callback);
            }

      }
  });
}

function creatQuizQuestions(taskObj, callback) {
  taskObj.questions = JSON.parse(taskObj.questions);
    async.each(taskObj.questions, function(question_obj, eachCallback) {
      question_obj.options = JSON.stringify(shuffle(question_obj.options));
       excuteQuery.queryForAll(sqlQueryMap['createQuizQuestions'], [taskObj.quiz_id,question_obj.question, question_obj.answer, question_obj.options], function(err, result) {
            if (err) {

                eachCallback(err, null);
            } else {
                eachCallback(null, result);
            }
        })
    }, function(err, result) {
        if (err) {
            callback(err, null);
        } else {
          createMaterialsQuiz(taskObj, callback);
        }
    });
}

function createMaterialsQuiz(materialObj,callback){
  excuteQuery.insertAndReturnKey(sqlQueryMap['insertMaterial'], [materialObj.title, materialObj.type, materialObj.hero_image, materialObj.estimated_time,
    materialObj.url, 1, materialObj.organization_id, materialObj.author, materialObj.quiz_id, materialObj.reflection_id,
    materialObj.user_id, new Date(), materialObj.user_id, new Date(), materialObj.content], function(err, result) {
      if (err) {
          callback(err, null);
      } else {
            if(result > 0){
              materialObj.material_id = result
              excuteQuery.queryForAll(sqlQueryMap['taskSortOrder'], [materialObj.lesson_id], function(err, materialResult) {
                if(err){
                  console.log(err);
                  callback(err, null);
                }else{
                  if (materialResult.length >0){
                    materialObj.sort_order = materialResult[0].sort_order + 1 ;
                  } else{
                    materialObj.sort_order = 1;
                  }
                insertIntoTaskVideoMaterials(materialObj, callback);
                }
              });
          }
       }
  });
}

/*function createQuizTask (taskObj){
	excuteQuery.insertAndReturnKey(sqlQueryMap['createTasksQuiz'], [taskObj.task_title,taskObj.description,100, taskObj.material_id,taskObj.lesson_id,taskObj.user_id,taskObj.user_id], function(err, result) {
			if (err) {
				console.log(err);
					callback(err, null);

			} else {
						if(result > 0){
								taskObj.task_id = result
								createQuiz(taskObj, callback);
						}
			}
	});
}

function createQuiz(taskObj, callback){
  excuteQuery.insertAndReturnKey(sqlQueryMap['createQuiz'], [taskObj.task_id,taskObj.lesson_id], function(err, result) {
      if (err) {
        console.log(err);
        console.log('hi')
          callback(err, null);
      } else {
            if (result > 0){
                taskObj.quiz_id = result;
                console.log(taskObj);
                creatQuizQuestions(taskObj, callback);
            }

      }
  });
}
*/


exports.createReflection = function(taskObj,callback){
  excuteQuery.insertAndReturnKey(sqlQueryMap['createReflection'], [taskObj.question,taskObj.lesson_id], function(err, result) {
      if (err) {
          callback(err, null);
      } else {
            if (result > 0){
              taskObj.reflection_id = result;
              createReflectionMaterial(taskObj, callback);
            }
      }
  });
}

function createReflectionMaterial(materialObj, callback){
  excuteQuery.insertAndReturnKey(sqlQueryMap['insertMaterial'], [materialObj.title, materialObj.type, materialObj.hero_image, materialObj.estimated_time,
    materialObj.url, 1, materialObj.organization_id, materialObj.author, materialObj.quiz_id, materialObj.reflection_id,
    materialObj.user_id, new Date(), materialObj.user_id, new Date(), materialObj.content], function(err, result) {
      if (err) {
          callback(err, null);
      } else {
            if (result > 0){
              materialObj.material_id = result;
              //createReflectionMaterialTask(materialObj, callback);
              excuteQuery.queryForAll(sqlQueryMap['taskSortOrder'], [materialObj.lesson_id], function(err, taskResult) {
                if(err){
                  console.log(err);
                  callback(err, null);
                }else{
                  if (taskResult.length >0){
                    materialObj.sort_order = taskResult[0].sort_order + 1 ;
                  } else{
                    materialObj.sort_order = 1;
                  }
                insertIntoTaskVideoMaterials(materialObj, callback);
                }
              });
            }
      }
  });
}

function createReflectionMaterialTask(taskObj, callback){
  excuteQuery.insertAndReturnKey(sqlQueryMap['createTasksQuiz'], [taskObj.task_title,taskObj.description,100, taskObj.material_id,taskObj.lesson_id,taskObj.user_id,taskObj.user_id], function(err, result) {
      if (err) {
          callback(err, null);
      } else {
            if(result > 0){
                taskObj.task_id = result;
                getAllTasks(taskObj.lesson_id, callback);
            }
      }
  });
}

exports.createMaterialTask = function(materialObj,callback){
  excuteQuery.insertAndReturnKey(sqlQueryMap['insertMaterial'], [materialObj.title, materialObj.type, materialObj.hero_image, materialObj.estimated_time, materialObj.url, materialObj.can_embed, materialObj.organization_id, materialObj.author, materialObj.quiz_id, materialObj.reflection_id, materialObj.user_id, new Date(), materialObj.user_id, new Date(), materialObj.content], 
    function(err, result) {
      if (err) {
          callback(err, null);
      } else {
            if(result > 0){
              materialObj.material_id = result
              excuteQuery.queryForAll(sqlQueryMap['taskSortOrder'], [materialObj.lesson_id], function(err, materialResult) {
                if(err){
                  console.log(err);
                  callback(err, null);
                }else{
                  if (materialResult.length >0){
                    materialObj.sort_order = materialResult[0].sort_order + 1 ;
                  } else{
                    materialObj.sort_order = 1;
                  }
                insertIntoTaskVideoMaterials(materialObj, callback);
                }
              });
          }
       }
  });
}

function insertIntoTaskVideoMaterials(materialObj, callback){
  console.log(materialObj);
  excuteQuery.insertAndReturnKey(sqlQueryMap['createTaskForMaterials'], [materialObj.task_title, materialObj.description, materialObj.material_id, materialObj.lesson_id, materialObj.sort_order, materialObj.user_id, materialObj.user_id], function(err, result) {
    if (err) {
    callback(err, null);
    } else {
    getAllTasks(materialObj.lesson_id, callback);
    }
  });
}

exports.createUserReflection = function(reflectionObj,callback){
  excuteQuery.insertAndReturnKey(sqlQueryMap['insertUserReflection'],
    [reflectionObj.user_id,reflectionObj.reflection_id,reflectionObj.response],function(err,result){
      if(err){
        callback(err,null);
      }else{
        if(result > 0 ){
          //callback(null,result);
          getAllTasks(reflectionObj.lesson_id,callback);
        }
      }

  });
}
exports.getReflectionDetails = function(task_id,callback){
 excuteQuery.queryForAll(sqlQueryMap['getReflectionDetails'], [task_id], function(err, result) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    });
}
exports.updateQuizTasks = function(taskObj,callback){
  excuteQuery.update(sqlQueryMap['updateTask'], [taskObj.task_title,taskObj.task_description, taskObj.user_id,taskObj.task_id],function(err,result){
    if(err){
      callback(err,null);
    }else{
      editQuizTask(taskObj,callback);
    }
  })
}
exports.updateReflectionTasks = function(taskObj,callback){
  excuteQuery.update(sqlQueryMap['updateTask'],[taskObj.task_title,taskObj.task_description, taskObj.user_id,taskObj.task_id],function(err,result){
    if(err){
      callback(err,null);
    }else{
      editReflectionTask(taskObj,callback);
    }

  });
}
function editQuizTask(taskObj,callback){
  async.each(taskObj.questions, function(question_obj, eachCallback) {
      question_obj.options = JSON.stringify(question_obj.options);
        excuteQuery.update(sqlQueryMap['editQuizQuestions'], [question_obj.question,question_obj.answer, question_obj.options,question_obj.quiz_question_id], function(err, result) {
            if (err) {
                eachCallback(err, null);
            } else {
                eachCallback(null, result);
            }
        })
    }, function(err, result) {
        if (err) {
            callback(err, null);
        } else {
          getAllTasks(taskObj.lesson_id, callback);
        }
    });

}
function editReflectionTask (taskObj,callback){
  excuteQuery.update(sqlQueryMap['editReflection'], [taskObj.question,taskObj.lesson_id], function(err, result) {
            if (err) {
                callback(err, null);
            } else {
                getAllTasks(taskObj.lesson_id,callback);
            }
        })
}
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

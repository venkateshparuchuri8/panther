exports.getSurveyList=function(org_id,callback){
    excuteQuery.queryForAll(sqlQueryMap['surveyList'], [org_id], function(err, result) {
        console.log(err);
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    });

}

exports.createNewSurvey = function(surveyObject,callback){
    excuteQuery.insertAndReturnKey(sqlQueryMap['createNewSurvey'], [surveyObject.survey_name, surveyObject.points, surveyObject.isMandatory, surveyObject.typeForm_id,
  surveyObject.organization_id, surveyObject.user_id, surveyObject.user_id, surveyObject.status, surveyObject.personal_info], function(err, result) {
        if (err) {
            callback(err, null);
        } else {
            console.log(result);
            excuteQuery.queryForAll( sqlQueryMap['postsurveyList'], [result], function(uperr, updatedResult) {
            if (uperr){
                callback(uperr, null);
            }else{
                if(updatedResult.length > 0){
                    callback(null, updatedResult[0]);
                }
            }

            });
        }

    });
};





exports.deleteSurvey = function(surveyObject,callback){
    excuteQuery.insertAndReturnKey(sqlQueryMap['deleteSurvey'], [surveyObject.survey_id], function(err, result) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, surveyObject);
        }
    });
};

exports.editSurvey = function(surveyObject,callback){
    console.log(surveyObject);
    excuteQuery.update(sqlQueryMap['updateSurvey'], [surveyObject.survey_name,surveyObject.points, surveyObject.personal_info, surveyObject.isMandatory,
      surveyObject.typeForm_id, surveyObject.user_id,  surveyObject.status,surveyObject.survey_id], function(err, result) {
        console.log(err);
        if (err) {
            callback(err, null);
        } else {

            excuteQuery.queryForAll( sqlQueryMap['postsurveyList'], [surveyObject.survey_id], function(uperr, updatedResult) {
            if (uperr){

                callback(uperr, null);
            }else{
                if(updatedResult.length > 0){
                    callback(null, updatedResult[0]);
                }
            }

            });
        }
    });
};

exports.playPauseSurvey = function(surveyObject,callback){
    excuteQuery.update(sqlQueryMap['playSurvey'], [surveyObject.user_id, surveyObject.survey_status, surveyObject.survey_id], function(err, result) {
        if (err) {
            callback(err, null);
        } else {
            console.log(result);
            excuteQuery.queryForAll( sqlQueryMap['postsurveyList'], [surveyObject.survey_id], function(uperr, updatedResult) {
            if (uperr){
                callback(uperr, null);
            }else{
                if(updatedResult.length > 0){
                    callback(null, updatedResult[0]);
                }
            }

            });
        }
    });
};

exports.surveyDetails=function(survey_id,callback){
    excuteQuery.queryForAll(sqlQueryMap['getSurveyDetails'], [survey_id], function(err, result) {
        console.log(err);
        if (err) {
            callback(err, null);
        } else {
           if (result.length > 0){
            callback(null, result[0]);
           }

        }
    });

}

exports.checksurveystatus=function(user_id,callback){
    surveyStatus (user_id, callback);
}

function surveyStatus (user_id, callback){
  excuteQuery.queryForAll(sqlQueryMap['checkUserSurveystatus'], [user_id, user_id], function(err, result) {
      console.log(err);
      if (err) {
          callback(err, null);
      } else {
        if (result.length > 0){
            callback(null, result[0]);
        } else {
            callback('No active surveys', null);
        }
      }
  });
}

exports.completeSurvey = function(surveyObject,callback){
    excuteQuery.insertAndReturnKey(sqlQueryMap['completeUserSurvey'], [surveyObject.user_id, surveyObject.survey_id, surveyObject.survey_status, surveyObject.user_id, surveyObject.user_id], function(err, result) {
        if (err) {
            callback(err, null);
        } else {
            surveyStatus (surveyObject.user_id, callback);
        }
    });
};

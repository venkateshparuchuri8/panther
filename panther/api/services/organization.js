exports.createNewOrganization = function(orgObj, callback) {
    excuteQuery.queryForAll(sqlQueryMap['createNewOrg'], [orgObj], function(err, result) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    });
}


exports.getOrgDetails = function(domain, callback) {
    excuteQuery.queryForAll(sqlQueryMap['getOrgDetails'], [domain], function(err, result) {
        if (err) {
            callback(err, null);
        } else {
          if(result.length > 0){
            callback(null, result[0]);
          }
        }
    });
}

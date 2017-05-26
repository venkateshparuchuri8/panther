exports.getAllReflections = function(org_id, callback) {
    excuteQuery.queryForAll(sqlQueryMap['OrgReflections'], [org_id], function(err, result) {
        //console.log(result);
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    })
};
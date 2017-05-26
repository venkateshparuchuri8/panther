exports.selectMaterials = function(organization_id, callback) {
    excuteQuery.queryForAll(sqlQueryMap['listofMaterials'], [organization_id], function(err, result) {
        //console.log(result);
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    })
};

exports.insertMaterialData = function(materialObj, callback) {
    excuteQuery.insertAndReturnKey(sqlQueryMap['insertMaterial'], [materialObj.title, materialObj.type, materialObj.hero_image, materialObj.estimated_time,
        materialObj.url, materialObj.can_embed, materialObj.organization_id, materialObj.author, materialObj.quiz_id, materialObj.reflection_id,
        materialObj.created_user, materialObj.created_date, materialObj.modified_user, materialObj.modified_date, materialObj.content
    ], function(err, rows) {
        if (err) {
            console.log(err.stack)
            callback(err, null);
        } else {
            callback(null, rows);
        }
    });
};

exports.updateMaterial = function(materialObject, callback) {
    excuteQuery.update(sqlQueryMap['updateMaterial'], [materialObject.title, materialObject.type, materialObject.hero_image,
        materialObject.estimated_time, materialObject.url, materialObject.author,
        materialObject.modified_user, materialObject.content, materialObject.id
    ], function(err, result) {
        console.log(err);
        if (err) {
            callback(err, null);
        } else {
            callback(err, result);
        }
    });
};
exports.getMaterial = function(material_id, callback) {
    excuteQuery.queryForAll(sqlQueryMap['materialDetails'], [material_id], function(err, result) {
        if (err) {
            callback(err, null);
        } else {
            var obj = {};
            obj.success = 'success';
            obj.result = result;
            callback(null, obj);

        }
    })
}

exports.getCompletedMaterials = function(user_id, callback) {
    excuteQuery.queryForAll(sqlQueryMap['UserCompletedMaterials'], [user_id], function(err, result) {
        //console.log(result);
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    })
};


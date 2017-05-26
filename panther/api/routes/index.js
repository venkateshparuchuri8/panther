var express = require('express');
var og = require('open-graph');
//var multer = require('multer');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.status(200).send({
        title: 'Express'
    });
});
router.post('/unsplash', function(req, res, next) {
    var clientId = 'c4e5eca82f48aa4f1bd7f87fccf0ad927ed835d163323ba2cb20bc2aba520f32'; //this is required to verify your application's requests
    unsplash.init(clientId);
    var start = req.body.start;
    var end = req.body.end;
    unsplash.getPhotos(start, end, function(error, photos, link) {
        if(error) {
            res.status(500).send(error);
        } else {
            res.status(200).send(photos);
        }
    });
});
router.post('/auth0/verifyuser', function(req, res, next) {
    var userObj = JSON.parse(req.body.userProfile);
    var org_id = req.body.org_id;
    var auth0_id = userObj.identities[0].user_id;
    excuteQuery.queryForAll(sqlQueryMap['verifyuserExistence'], [auth0_id, org_id], function(err, user) {
        if (err) {
            console.error(err.stack);
            res.status(500).send(err);
        } else {
            if (user.length > 0) {
                var obj = {}
                obj.status = 'success';
                obj.result = user[0];
                obj.result.first_time = false;
                res.status(200).send(obj);
            } else {
                var newUser = {};
                newUser.auth0_id = auth0_id;
                newUser.email = userObj.email;
                newUser.profile_pic = userObj.picture;
                newUser.gender = userObj.gender;
                newUser.name = userObj.name;
                excuteQuery.insertAndReturnKey(sqlQueryMap['insertNewMemberUser'], [userObj.name, auth0_id, userObj.email, userObj.gender, userObj.picture], function(err, insertedid) {
                    if (err) {
                        console.error(err.stack);
                        res.status(500).send(err);
                    } else {
                        if (insertedid > 0) {
                            excuteQuery.insertAndReturnKey(sqlQueryMap['insertIntoOrgUser'], [org_id, insertedid], function(err, orguser) {
                                if (err) {
                                    console.error(err.stack);
                                    res.status(500).send(err);
                                } else {
                                    if (orguser > 0) {
                                        excuteQuery.queryForAll(sqlQueryMap['verifyuserExistence'], [auth0_id, org_id], function(err, insertedUser) {
                                            if (err) {
                                                console.error(err.stack);
                                                res.status(500).send(err);
                                            } else {
                                                if (insertedUser.length > 0) {
                                                    var obj = {}
                                                    obj.status = 'success';
                                                    obj.result = insertedUser[0];
                                                    obj.result.first_time = true;
                                                    res.status(200).send(obj);
                                                } else {
                                                    res.status(500).send("Unable to fetch user details");
                                                }
                                            }
                                        });
                                    } else {
                                        res.status(500).send("Problem allocation organization");
                                    }
                                }
                            });
                        } else {
                            res.status(500).send("Problem inserting user");
                        }
                    }
                });
            }
        }
    });
});

router.put('/updateuser', function(req, res, next) {
    var user_obj = req.body; //this is required to verify your application's requests
    excuteQuery.update(sqlQueryMap['updateUserDetails'], [user_obj.gender, user_obj.dob, user_obj.profile_pic,
      user_obj.profile_bio, user_obj.address, user_obj.city, user_obj.state, user_obj.zip_code, user_obj.phone, user_obj.chapter, user_obj.position, user_obj.twitter, user_obj.facebook, user_obj.user_id, user_obj.user_id], function(err, user) {
      if (err){
        res.status(500).send(err);
      }else{
        res.status(200).send({"result":user_obj,"status": "success"});
      }
    });
});

router.post('/userscore/totalpoints/:user_id', function(req, res, next) {
    var user_id = req.params.user_id; //this is required to verify your application's requests
    excuteQuery.queryForAll(sqlQueryMap['totalPointsUser'], [user_id], function(err, result) {
        if (err) {
            res.status(500).send(err);
        } else {
            if (result.length > 0) {
                res.status(200).send({
                    "result": result[0],
                    "status": "success"
                });
            }
        }
    });
});
router.post('/articles/modaldata', function(req, res, next) {
    var url = req.body.material_url;
    og(url, function(err, meta) {
        if (err) {
            res.status(500).send({"status": "failed","result": "Please Enter a valid URL"});
        } else {
            res.status(200).send({"result":meta, "status": "success"});
        }
    });
    //var request = require('request');
    // request(url, function(error, response, html) {
    //     if (!error && response.statusCode == 200) {
    //         res.send({"result":html,"status":"success"});
    //     }else{
    //       res.send(error);
    //     }
    // });
});

router.post('/unsplash/search', function(req, res, next) {
    var clientId = 'c4e5eca82f48aa4f1bd7f87fccf0ad927ed835d163323ba2cb20bc2aba520f32'; //this is required to verify your application's requests
    unsplash.init(clientId);
    var start = req.body.start;
    var end = req.body.end;
    var category = req.body.category;
    unsplash.searchPhotos(category, null, start, end, function(error, photos, link) {
        //Access 20 photos from second page of search results with filtering categories applied here
        if (error) {
            console.log(error);
            res.status(500).send(error);
        } else {
            res.status(200).send(photos);
        }
    });
});

router.post('/getmetadata', function(req, res, next) {
    var url = req.body.url;
    og(url, function(err, meta) {
        if (err) {
            res.status(200).send({
                "status": "failed",
                "result": "Please Enter a valid URL"
            });
        } else {
            var obj = {};
            if (meta.title) {
                obj.status = "success";
                obj.result = {};
                obj.result.title = meta.title;
                if (meta.site_name || meta.image) {
                    obj.result.author = meta.site_name;
                    obj.result.url = meta.image.url;
                }
            } else {
                obj.status = "success";
                obj.result = "No Data";
            }
            res.status(200).send(obj);
        }
    });
});

router.post('/picupload', function(req, res, next) {
    var filename = uuid.v4() + '-' + uslug(req.body.fileUrl);

    var ext = req.body.ext;
    var readStream = request.get({
        url: req.body.imgDta,
    });
    name = filename + ext;
    storeInAmazon(readStream, name, function(err, url) {
        var jsonRes = {};
        jsonRes.success = true;
        jsonRes.url = url;
        res.status(201).send(JSON.stringify(jsonRes));
    });

});


function storeInAmazon(readStream, name, callback) {
    var config = {
        provider: props.cloudProvide,
        key: props.cloudSecretKey, // secret key
        keyId: props.cloudAccessKey, // access key id
        region: props.cloudRegion // region 'us-east-1'
    };
    var client = require('pkgcloud').storage.createClient(config);
    var amazonContainer = props.cloudContainer;

    var writeStream = client.upload({
        container: amazonContainer,
        remote: name
    });
    readStream.pipe(writeStream);
    writeStream.on('error', function(err) {
        // handle your error case
        callback(err, null);
    });
    writeStream.on('success', function(file) {
        // success, file will be a File model
        var cdnurl = props.cloudurl;
        callback(null, cdnurl + name);
    });
}


router.post('/youtubeapi', function(req, res, next) {
    var value = req.body.url;
    if (value.indexOf('youtube') != -1) {
        var videoSplit = value.split('v=')[1];
        if (videoSplit.indexOf('&') != -1) {
            var videoId = videoSplit.split('&')[0];
        } else {
            var videoId = videoSplit;
        }
        var YouTube = require('youtube-node');

        var youTube = new YouTube();
        youTube.setKey('AIzaSyDYwPzLevXauI-kTSVXTLroLyHEONuF9Rw');

        youTube.getById(videoId, function(error, uResult) {
            if (error) {
                console.log(error);
            } else {
                var obj = {};
                obj.status = "success";
                obj.result = {};
                if(uResult.items[0]) {
                    obj.result.title = uResult.items[0].snippet.title;
                    obj.result.image_url = uResult.items[0].snippet.thumbnails.default.url;
                    obj.result.estimated_time = convert_time(uResult.items[0].contentDetails.duration);
                }
                res.status(200).send(obj);
            }
        });
    } else if (value.indexOf('vimeo') != -1) {
        var videoSplit = value.split('/');
        var videoId = videoSplit[videoSplit.length - 1];
        var video = require('n-vimeo').video;
        video(videoId, function(err, data) {
            if (err) {
                console.log(err);
            } else {
                var obj = {};
                obj.status = "success";
                obj.result = {};
                if(data.raw) {
                    obj.result.title = data.raw.title;
                    obj.result.image_url = data.raw.thumbnail_small;
                    obj.result.estimated_time = data.raw.duration;
                }
                res.status(200).send(obj);
            }

        });
    } else {
        og(value, function(err, meta){
            if(err) {
               res.status(200).send({
                    "status": "failed",
                    "result": "Not a Valid URL"
                }) 
            } else {
                var obj = {};
                obj.status = "success";
                obj.result = {};
                if(meta) {
                    obj.result.title = meta.title;
                    if(meta.image) obj.result.image_url = meta.image.url;
                }
                res.status(200).send(obj);
            }
            
        })
    }
});

function convert_time(duration) {
    var a = duration.match(/\d+/g);

    if (duration.indexOf('M') >= 0 && duration.indexOf('H') == -1 && duration.indexOf('S') == -1) {
        a = [0, a[0], 0];
    }

    if (duration.indexOf('H') >= 0 && duration.indexOf('M') == -1) {
        a = [a[0], 0, a[1]];
    }
    if (duration.indexOf('H') >= 0 && duration.indexOf('M') == -1 && duration.indexOf('S') == -1) {
        a = [a[0], 0, 0];
    }

    duration = 0;

    if (a.length == 3) {
        duration = duration + parseInt(a[0]) * 3600;
        duration = duration + parseInt(a[1]) * 60;
        duration = duration + parseInt(a[2]);
    }

    if (a.length == 2) {
        duration = duration + parseInt(a[0]) * 60;
        duration = duration + parseInt(a[1]);
    }

    if (a.length == 1) {
        duration = duration + parseInt(a[0]);
    }
    return duration
}
module.exports = router;

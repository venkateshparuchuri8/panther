var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var log4js = require('log4js'); //note the need to call the function
var parser = require('xml2json');
var hbs = require('express-hbs');
var fs = require('fs');
unsplash = require('unsplash-api');
multer = require('multer');
og = require('open-graph');

var app = express();

app.use(multer({
    dest: 'uploads/'
}))
app.post('/api/fileupload', function(req, res, next) {
      //This method depends on the file name parameter we need to be careful in writing the code for this
     //May be should take the filename also as parameter. Here 'files[]' is a parameter that the editorInsert
     //Plugin sends.
     console.log(req.files);
    if (req.files && req.files.image.path) {
         path = __dirname + "/" + req.files.image.path;
         var filename = uuid.v4() + '-' + uslug(req.files.image.name);
         var name = req.files.image.name
         var readStream = fs.createReadStream(path);
         storeInAmazon(readStream, name, function(err, url) {
             if (err) {
                 console.log(err);
                 res.send(err);
             } else {
                 var files = []
                 var jsonRes = {};
                 jsonRes.url = url;
                 files.push(jsonRes)
                 var obj = {};
                 obj.files = files
                 res.send(JSON.stringify(obj));
                 fs.unlink(__dirname+'/uploads/'+name);

             }
         })
     }
 });


request = require('request');
passport = require('passport');
FacebookStrategy = require('passport-facebook').Strategy;
uuid = require('node-uuid')
logger = log4js.getLogger('js-backend');
db_template = require('db-template');
mysql = require('mysql');
uuid = require('node-uuid');
uslug = require('uslug');
async = require('async');
moment = require('moment');
underscore = require('underscore')


//Appplication Routes
var index = require('./routes/index');
var users = require('./routes/user');
var course = require('./routes/course');
var courseClass = require('./routes/class');
var lesson = require('./routes/lesson');
var organization = require('./routes/organization');
var survey = require('./routes/survey');
var material = require('./routes/material');
var action = require('./routes/action');
var tasks = require('./routes/task');
var member=require('./routes/memberdashboard');
var quiz=require('./routes/quiz');
var reflection=require('./routes/reflection');
var bug=require('./routes/bug');

var content = fs.readFileSync(__dirname + '/sql-queries.xml');
var json = parser.toJson(content, {
    sanitize: false
});
var sqlQueries = JSON.parse(json)['sql-queries']['sql-query']
sqlQueryMap = {}
for (var i = 0; i < sqlQueries.length; i++) {
    sqlQueryMap[sqlQueries[i]['id']] = sqlQueries[i]['$t']
}

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs', hbs.express4({
    //partialsDir: __dirname + '/views/partials',
    layoutsDir: __dirname + '/views/layouts'
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());

props = require('config').props;
pool = mysql.createPool({
    host: props.host,
    user: props.username,
    password: props.password,
    port: props.port,
    database: props.database
});
excuteQuery = db_template(pool)
    //Unslash API
    //Default goes to api URL.
app.use(function(req, res, next) {
    console.log(req.path);
    next();
})
app.use('/api', index);
app.use('/api/course', course);
app.use('/api/lesson', lesson);
app.use('/api/survey', survey);
app.use('/api/org', organization);
app.use('/api/class', courseClass);
app.use('/api/user', users);
//app.use('/api/org', org);
app.use('/api/material', material);
app.use('/api/action', action);
app.use('/api/tasks', tasks);
app.use('/api/member',member);
app.use('/api/quiz',quiz);
app.use('/api/reflection',reflection);
app.use('/api/bug', bug);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    console.error(err);
    // render the error page
    res.status(err.status || 500);
    //  console.log(err);
    res.render('error');
});
global.setDevHeaders = function(res) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Authorization,x-access-token')
}

var config = {
    provider: "amazon",
    key: props.cloudSecretKey, // secret key
    keyId: props.cloudAccessKey, // access key id
    container: props.cloudContainer,
    region: 'us-east-1' // region
};
function storeInAmazon(readStream, name, callback) {
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
module.exports = app;

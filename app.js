var config = require('./config/config.js'),
	express = require('express'),
	morgan = require('morgan'),
	compress = require('compression'),
	bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser'),
	methodOverride = require('method-override'),
	session = require('express-session'),
	flash = require('connect-flash'),
	passport = require('passport'),
	layouts = require('express-ejs-layouts'),
	path = require('path'),
	mongoose = require('mongoose'),
	objectID = require('bson-objectid');

var app = express();

if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
} else if (process.env.NODE_ENV === 'production') {
	app.use(compress());
}

app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(methodOverride());

app.use(session({
	saveUninitialized: true,
	resave: true,
	secret: config.secret
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set("layout", true);
app.set('layout', '_layout');

app.use(flash());
app.use(layouts);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/client', express.static(__dirname + '/client'));
app.use('/template', express.static(__dirname + '/views/layouts/app'));
// app.use('/public', express.static(__dirname + '/public'));
var db = mongoose.connect(config.db);
var http = require('http').Server(app),
	io = require('socket.io')(http);
	
require('./config/passport.js')();
require('./server/routes/cpanel.js')(app);
require('./server/routes/index.js')(app);
require('./server/routes/member.js')(app);
require('./server/routes/api.js')(app);
require('./server/routes/app.js')(app, io.sockets);

app.all('/app/*', function(req, res){
	res.render('_app', {
		layout: '_appLayout'
	});
});

http.listen(config.port);
module.exports = app;
console.log('App is running on port ' + config.port);
// Invoke 'strict' JavaScript mode
'use strict';
var passport = require('passport'),
	member = require('../models/member'),
	hash = require('password-hash'),
	Key = require('../models/key'),
	url = require('url'),
	path = require('path'),
	bson = require('bson-objectid'),
	multer  = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/members')
    },
    filename: function (req, file, cb) {
        cb(null,req.objID + path.extname(file.originalname));
    }
});
var upload = multer({ storage: storage });

// Define the routes module' method
module.exports = function (app) {
	app.get('/cpanel/member/changepwd', function (req, res) {
		res.render('layouts/member/changepwd', {
			title: "Change Password",
			user: req.user,
			type_message: req.flash('type'),
			message: req.flash('message'),
		});
	});
	app.post('/cpanel/member/changepwd', function (req, res) {
		if(req.body.pwd != req.body.rtpwd){
			req.flash('type', 'danger');
			req.flash('message', 'Passwords are not the same');
			res.redirect('/cpanel/member/changepwd');
		}else{
			member.findById(req.user._id, function(err, m){
				var newPwd = hash.generate(req.body.pwd);
				m.pwd = newPwd;
				m.save();
				req.user.pwd = newPwd;
				req.flash('type', 'success');
				req.flash('message', 'Password changed!');
				res.redirect('/cpanel/dashboard');
			});
		}
	});

	app.get('/cpanel/member/profile', function (req, res) {
		res.render('layouts/member/profile', {
			title: req.user.uid,
	        user: req.user
	    });
	});

	app.post('/cpanel/member/profile/update', 
		function( req , res , next) {
		     var objID = bson.generate();
		     req.objID = objID;
		     next();
		},
		upload.single('avatar'),
		function(req, res){
		member.findById(req.user._id, function(err, m){
			if(req.file){
				m.avatar = '/uploads/members/'+req.file.filename;
				req.user.avatar = '/uploads/members/'+req.file.filename;
			}else{
				if(req.body.url != ""){
					m.avatar = req.body.url;
					req.user.avatar = req.body.url;
				}
			}
			m.uid = req.body.uid;
			m.mal = req.body.mail;
			m.save();
			req.user.uid = req.body.uid;
			req.user.mal = req.body.mal;
			req.user.fn = req.body.fn;
			req.user.ln = req.body.ln;
			req.flash('type', 'success');
			req.flash('message', 'Updated Profile Successfully!');
			res.redirect('/cpanel/dashboard');
		});
	});
	app.get('/member/register', function (req, res) {
		res.render("layouts/member/register", {
			title: "Register",
			layout: "_member.ejs",
			messages: req.flash('error') || req.flash('info')
		});
	});

	app.post('/member/register', function (req, res) {

		var _uid = req.body.uid;
		var _mail = req.body.mail;
		var _pwd = req.body.pwd;

		member.find({
			$or: [{
				'uid': _uid
			}, {
				'mail': _mail
			}]
		}, function (err, user) {
			if (user && user.length > 0) {
				req.flash('info', 'UserId or E-mail already exists');
				res.redirect('/member/register');
			} else {
				var _u = new member({
					uid: _uid,
					mail: _mail,
					pwd: hash.generate(_pwd)
				}).save(function (err, user) {
					return res.redirect('/member/login');
				});
			}
		});

	});
	app.get('/member/forgot-password', function(req, res){
		res.render('layouts/member/forgot-password', {
			title: 'Forgot Password',
			layout: '_member',
			type_message: req.flash('type'),
			message: req.flash('message'),
		});
	});
	app.post('/member/forgot-password', function(req, res){
		var key = hash.generate(Math.random().toString());
		member.findOne({mail: req.body.mail}, function(err, m){
			if(m != null){
				new Key({
					mail: req.body.mail,
					key: key,
					last: Date.now() + 86400000
				}).save();
			}else{
				req.flash('type', 'Email not existed');
				return res.redirect('/member/forgot-password');
			}
		});
		require('../config/mail')(
			req.body.mail, 
			'Codek', 
			'<div style="background:#1584C7;color:#FFF;padding:5px">Click <a href="'+req.headers.host+'/restore-password?mail='+req.body.mail+'&key='+key+'">here</a> to restore password<div>', 
			'Restore Password'
		);
		req.flash('type', 'success');
		req.flash('message', 'Please check your email!');
		
		res.redirect('/member/forgot-password');
	});	
	app.get('/member/restore-password', function(req, res){
		Key.findOne({
			mail: req.query.mail,
			key: req.query.key
		}, function(err, k){
			if(k != null){
				if(parseInt(Date.now()) < parseInt(k.last)){
					member.findOne({
						mail: k.mail
					}, function(err, m){
						m.pwd = hash.generate('12345678')
						m.save();
						res.redirect('/member/login');
					});
				}else{
					res.send('Out of date');
				}
				Key.remove({
					mail: req.query.mail,
					key: req.query.key
				}).exec();
			}else{
				res.send('Key not available');
			}
			
		});

	});
	app.route('/member/login')
		.get(function (req, res) {
			return res.render("layouts/member/login", {
				title: "Login",
				layout: "_member.ejs",
				messages: req.flash('error') || req.flash('info')
			});
		})
		.post(passport.authenticate('local', {
			successRedirect: '/',
			failureRedirect: '/member/login',
			failureFlash: true
		}));


	app.get('/member/logout', function (req, res) {
		req.logout();
		res.redirect('/');
	});


};

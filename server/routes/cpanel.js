'use strict';
var Post = require('../models/post');
var Quest = require('../models/question');
var path = require('path');
var bson = require('bson-objectid');
var Answer = require('../models/answer');
var Examp = require('../models/examp');
var multer  = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/datas')
    },
    filename: function (req, file, cb) {
        cb(null,req.objID + path.extname(file.originalname));
    }
});
var upload = multer({ storage: storage });

module.exports = function(app) {
    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) return next();
        return res.redirect('/member/login');
    };
    // app.all('/cpanel/*', isLoggedIn);
    app.get('/cpanel/dashboard', function(req, res) {
        //  require('../models/ip.js')({
        //     _id:'127.0.0.1',
        //     "as":"AS7552 Viettel Corporation",
        //     "city":"Hanoi",
        //     "country":"Vietnam",
        //     "countryCode":"VN",
        //     "isp":"Viettel Corporation",
        //     "lat":21.0333,
        //     "lon":105.85,
        //     "org":"Viettel Corporation",
        //     "region":"64",
        //     "regionName":
        //     "Thanh Pho Ha Noi",
        //     "status":"success",
        //     "timezone":"Asia/Ho_Chi_Minh",
        //     "zip":"",
        //     stt:1
        //  }).save();
        return res.render('./cpanel/dashboard', {
          user: req.user || '',
          title: 'Cpanel | Dashboard',
          message: req.flash('message'),
          type_message: req.flash('type')
        });
    });
   /* router post */
   app.get('/cpanel/posts', function(req, res){
      res.render('cpanel/post/view', {
        user: req.user || '',
        title: 'Cpanel | Post',
        message: req.flash('message'),
        type_message: req.flash('type')
      });
   });
   app.get('/cpanel/posts/create', function(req, res){
      if(req.body != ''){
        var post = req.body;
      }else{
        var post = null;
      }
      res.render('cpanel/post/both', {
        user: req.user || '',
          title: 'Cpanel | Create Post',
         action: 'create',
         post: post,
         message: req.flash('message'),
        type_message: req.flash('type')
      });
   });
   app.get('/cpanel/posts/delete/:post_id', function(req, res){
      Post.remove({_id: req.params.post_id}).exec();
      req.flash('message', 'Removed Post Successfully!');
      req.flash('type', 'success');
      res.redirect('/cpanel/posts');
   });
   app.get('/cpanel/posts/update/:post_id', function(req, res){
      Post.findById(req.params.post_id, function(err, p){
         res.render('cpanel/post/both', {
            user: req.user || '',
            title: 'Cpanel | Update Post',
            action: 'update',
            post: p,
            message: req.flash('message'),
            type_message: req.flash('type')
         });
      });
      
   });
   app.post('/cpanel/posts/both',
      function( req , res , next) {
         var objID = bson.generate();
         req.objID = objID;
         next();
     },
     upload.single('img'), function(req, res){
      var tags = [];
      var arr = req.body.tags.replace(/ /g, '').split(",");
      for (var i = 0; i < arr.length; i++) {
         tags.push(arr[i].replace('\r', ''));
      };
      req.body.tags = tags;
      if(req.file){
        req.body.img = '/uploads/datas/'+req.file.filename;
      }else{
        if(req.body.url != ""){
          req.body.img = req.body.url;
        }else{
          req.body.img = req.body.src;
        }
        
      }
      switch(req.body.action){
         case 'update':
            Post.findById(req.body._id, function(err, p){
               p.tl = req.body.tl.trim();
               p.pl = req.body.pl;
               p._uid = req.user.uid;
               p.url = req.body.tl.trim().toLowerCase().replace(/ /g, '-').replace(/\//g, '-').replace(/---/, '-').replace(/--/, '-');
               p.desc = req.body.desc;
               p.source = req.body.source;
               p.htm = req.body.htm;
               p.tags = req.body.tags;
               p.tp = req.body.tp;
               p.img = req.body.img;
               p.save();
            });
            req.flash('message', 'Updated Post Successfully!');
            req.flash('type', 'success');
            res.redirect('/cpanel/posts');
            break;
         case 'create':
            Post.findOne({tl: req.body.tl}, function(err, p){
               if(p == null){
                  req.body.action = null;
                  req.body._id = null;
                  req.body._uid = req.user.uid;
                  req.body.url = req.body.tl.toLowerCase().replace(/ /g, '-');
                  new Post(req.body).save();
                  req.flash('message', 'Added Post Successfully!');
                  req.flash('type', 'success');
                  res.redirect('/cpanel/posts/create');
               }else
               {
                  req.flash('message', 'Post existed!');
                  req.flash('type', 'danger');
                  res.redirect('/cpanel/posts/create');
               }
            });
            break;
      }
      
   });
   app.get('/api/v1/post/list', function(req, res){
      Post.find({}, function(err, p){
         res.jsonp({data: p});
      });
   });
   /**/
   app.get('/api/v1/question/:eid/list/all', function(req, res){
    Quest.find({eid: req.params.eid}).exec(function(err, q){
      res.jsonp({data: q});
    });
  });
   
   app.get('/cpanel/examp/:eid/question', function(req, res){
      res.render('cpanel/question/view', {
        layout: '_layout',
        title: 'Question Manager',
        user: req.user || '',
        eid: req.params.eid,
        message: req.flash('message'),
        type_message: req.flash('type')
      });
   });
   
   app.get('/cpanel/examp/:eid/question/create', function(req, res){
    res.render('cpanel/question/both', {
        layout: '_layout',
        action: 'create',
        quest: '',
        eid: req.params.eid,
        title: 'Create Question',
        user: req.user || '',
        message: req.flash('message'),
        type_message: req.flash('type')
    });
   });
   app.post('/cpanel/examp/:eid/question/both',
      function( req , res , next) {
         var objID = bson.generate();
         req.objID = objID;
         next();
     },
     upload.single('img'), function(req, res){
      if(req.file){
        req.body.img = '/uploads/datas/'+req.file.filename;
      }else{
        if(req.body.url != ""){
          req.body.img = req.body.url;
        }else{
          req.body.img = req.body.src;
        }
        
      }
      switch(req.body.action){
         case 'update':
            Quest.findById(req.body._id, function(err, q){
               q.content = req.body.content;
               q.type = req.body.type;
               q.level = req.body.level;
               q.img = req.body.img;
               p.save();
            });
            req.flash('message', 'Updated Question Successfully!');
            req.flash('type', 'success');
            res.redirect('/cpanel/examp/'+req.params.eid+'/question');
            break;
         case 'create':
            Quest.findOne({content: req.body.content}, function(err, p){
               if(p == null){
                  req.body.action = null;
                  // req.body._id = null;
                  new Quest({
                    eid: req.params.eid,
                    content: req.body.content,
                    type: req.body.type,
                    level: req.body.level,
                    img: req.body.img
                  }).save(function(err, newQ){
                    if(err){
                      console.log(err);
                    }
                      if(newQ){
                        req.flash('message', 'Added Question Successfully!');
                        req.flash('type', 'success');
                        res.redirect('/cpanel/examp/'+req.params.eid+'/question/' + newQ._id + '/create-answer');
                      }
                  });
                  
               }else
               {
                  req.flash('message', 'Question existed!');
                  req.flash('type', 'danger');
                  res.redirect('/cpanel/examp/:eid/question/create');

               }
            });
            break;
      }
      
   });
  app.get('/cpanel/examp/:eid/question/delete/:quest_id', function(req, res){
      Quest.remove({_id: req.params.quest_id}).exec();
      req.flash('message', 'Removed Question Successfully!');
      req.flash('type', 'success');
      res.redirect('/cpanel/examp/' + req.params.eid + '/question');
   });
  app.get('/cpanel/examp/:eid/question/:quest_id/create-answer', function(req, res){
    Quest.findById(req.params.quest_id, function(err, q){
        res.render('cpanel/question/answer', {
          layout: '_layout',
          quest: q,
          eid: req.params.eid,
          title: 'Create Answer',
          user: req.user || '',
          message: req.flash('message'),
          type_message: req.flash('type')
      });
    });
  });
  app.post('/cpanel/examp/:eid/question/:quest_id/create-answer', function(req, res){
      for (var i = 0; i < req.body.content.length; i++) {
        var data = {};
        if(req.body.content[i].trim() != ""){
          if(req.body.right == i){
            data.right = true;
          }
          data.qid = req.params.quest_id;
          data.content = req.body.content[i];
          new Answer(data).save();
        }
        
      };
      req.flash('message', 'Add Answer Successfully!');
      req.flash('type', 'success');
      res.redirect('/cpanel/examp/'+req.params.eid+'/question');
  });
  /**/
  app.get('/api/v1/examp/list', function(req, res){
    Examp.find({}, function(err, e){
      res.json({data: e});
    });
  }); 
  app.get('/cpanel/examp', function(req, res){
    res.render('cpanel/examp/view', {
        layout: '_layout',
        title: 'Examp Manager',
        user: req.user || '',
        message: req.flash('message'),
        type_message: req.flash('type')
      });
  });
  app.get('/cpanel/examp/create', function(req, res){
      new Examp().save();
      req.flash('message', 'Add Examp Successfully!');
      req.flash('type', 'success');
      res.redirect('/cpanel/examp');
  });
  /**/
};
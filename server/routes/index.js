var Post = require('../models/post');
module.exports = function(app) {
    app.get('/', function(req, res) {
        res.render('layouts/home/home', {
            title: 'Trang chủ',
            user: req.user,
            layout: '_index'
        });
    });
    app.get('/news', function(req, res) {
    	if(req.query.page){
    		var page = req.query.page;
    	}else{
    		page = 1;
    	}
    	Post.find({}).sort({view: -1}).skip(page * 10 - 10).limit(10).exec(function(err, p){
    		res.render('layouts/home/news', {
	            title: 'Tin tức',
                user: req.user,
	            data: p,
                layout: '_index'
	        });
    	});
    });
    app.get('/news/:url', function(req, res){
    	Post.findOne({url: req.params.url}, function(err, p){
    		res.render('layouts/home/post', {
    			title: p.title,
                user: req.user,
    			data: p,
                layout: '_index'
    		});
    	});
    });
}
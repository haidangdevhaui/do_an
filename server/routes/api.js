var Quest = require('../models/question');
var Answer = require('../models/answer');
var Examp = require('../models/examp');

module.exports = function(app, socket){
	app.get('/api/v1/question/list', function(req, res){
		if(req.query.page){
			var page = req.query.page;
		}else{
			var page = 1;
		}
		if(req.query.rec){
			var rec = req.query.rec;
		}else{
			var rec = 10;
		}
		Quest.find({}).skip(page * rec -rec).limit(rec).exec(function(err, q){
			var data = [];
			if(q.length != 0){
				for (var i = 0; i < q.length; i++) {
					var qObj = q[i];
					Answer.find({qid: qObj._id}, function(err, a){
						qObj.ans = a;
						data.push(qObj);
						if(i == q.length){
							res.jsonp({
								questions: data
							});
						}
					});
				};
			}
			
		});
	});
	app.get('/api/v1/examp/list', function(req, res){
		Examp.find({}, function(err, e){
			res.jsonp(e);
		});
	});
	app.get('/api/v1/examp/:eid/list-question', function(req, res){
		Quest.find({eid: req.params.eid}).limit(20).exec(function(err, q){
			res.jsonp(q);
		});
	});
	app.get('/api/v1/question/:qid', function(req, res){
		Quest.findById(req.params.qid, function(err, q){
			Answer.find({qid: req.params.qid}, function(err, a){
				q.ans = a;
				res.json(q);
			});
		});
	});
	app.get('/api/v1/examp/:eid/:next', function(req, res){
		Quest.find({eid: req.params.eid}).limit(20).exec(function(err, q){
			Answer.find({qid: q[req.params.next]._id}, function(err, a){
				q[req.params.next].ans = a;
				res.json(q[req.params.next]);
			});
		});
	});
	app.get('/api/v1/user', function(req, res){
		res.json(req.user);
	});
}

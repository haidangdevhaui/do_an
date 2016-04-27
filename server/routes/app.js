var config = require('../../config/config');
var Answer = require('../models/answer');
var Agenda = require('agenda');
var agenda = new Agenda({db: {address: config.db}});

module.exports = function(app, socket){
	function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) return next();
        return res.redirect('/member/login');
    };
    app.all('/app/*', isLoggedIn);
    app.get('/app', function(req, res){
    	res.render('_app', {
			layout: '_appLayout'
		});
    });

    app.get('/app/server/start-examp', function(req, res){
    	var timeOut = new Date(Date.now() + 1 * 60000);
    	agenda.schedule(timeOut, 'stop-examp', {client: req.user._id});
		agenda.start();
		res.json({
			"start": Date.now()
		});
	});
    agenda.define('stop-examp', function(job, done){
    	socket.emit('out-of-time', job.attrs.data.client);
    	console.log('time out');
    	job.remove();
    	done();
    });
    app.post('/app/server/end-examp', function(req, res){
        agenda.cancel({data: {client: req.user._id}}, function(err, numRemoved) {});
        var score = 0;
        function execScore(arr, i, callback){
            i ++;
            if(arr.length == 0){
                return callback(0);
            }
            if(arr.length > i){
                Answer.findById(arr[i].aid, function(err, a){
                    if(a.right == true){
                        score ++;
                    }
                    execScore(arr, i, callback);
                });
            }
            if(arr.length == i){
                return callback(score);
            }
        }
        execScore(req.body, -1, function(result){
            if(config.examp.pass > score){
                var pass = false;
            }else{
                var pass = true;
            }
            res.jsonp({
                total: req.body.length,
                score: result,
                pass: pass
            });
        })
    });
}

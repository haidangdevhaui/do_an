var mongoose = require('mongoose');
var model = new mongoose.Schema({
	pid: String,
	uid: String,
	content: String,
	status: Number,
	crt: {
        type: Date,
        default: Date.now()
    }
});
module.exports = mongoose.model('Comments', model);
var mongoose = require('mongoose');
var model = new mongoose.Schema({
	type: String,
	name: String,
	crt: {
        type: Date,
        default: Date.now()
    }
});
module.exports = mongoose.model('examps', model);
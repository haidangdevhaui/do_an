var mongoose = require('mongoose');
var model = new mongoose.Schema({
	ip: String
});
module.exports = mongoose.model('clients', model);
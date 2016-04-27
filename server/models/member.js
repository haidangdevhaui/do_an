var mongoose = require('mongoose'),
	hash = require('password-hash');

var memberSchema = new mongoose.Schema({
	uid: String,
	pwd: String,
	mail: String,
	fn: String,
  	ln: String,
  	avatar: {
  		type: String,
  		default: "/uploads/members/default.png"
  	},
	stt: Number,
  // last action
  	act: {
		type: Date,
		default: Date.now()
	},
	crt: {
		type: Date,
		default: Date.now()
	}

}, {
	collection: 'members'
});


memberSchema.methods.hashPassword = function (password) {
	return hash.generate(password);
};
memberSchema.methods.authenticate = function (password) {
	return hash.verify(password, this.pwd);
};

module.exports = mongoose.model('member', memberSchema);

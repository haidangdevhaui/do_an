var mongoose = require('mongoose');
var modelSchema = mongoose.Schema({
	qid: String,
    content: String,
    right: {
    	type: Boolean,
    	default: false
    },
    crt: {
         type: Date,
         default: Date.now()
      }
});

module.exports = mongoose.model('answers', modelSchema);

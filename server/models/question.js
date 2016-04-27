var mongoose = require('mongoose');
var modelSchema = mongoose.Schema({
	// _id: mongoose.Schema.Types.ObjectId,
    eid: String,
    content: String,
    type: Number,
    level: Number,
    img: String,
    ans: [],
    crt: {
         type: Date,
         default: Date.now()
      }
});
module.exports = mongoose.model('questions', modelSchema);

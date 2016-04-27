var mongoose = require('mongoose');

var keySchema = new mongoose.Schema({
    mail: String,
    key: String,
    last: Number
}, {
    collection: 'keys'
});
module.exports = mongoose.model('key', keySchema);

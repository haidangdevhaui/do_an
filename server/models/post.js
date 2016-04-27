var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var schema = new mongoose.Schema({
    _uid: String,

    // Title
    tl: String,
    url: String,
    // Page Title
    pl: String,
    // Description
    desc: String,
    // Image
    img: String,
    source: String,

    // Html Content
    htm: String,
    view: {
        type: Number,
        default: 0
    },

    tags: [String],

    tp: Number, // 0: Link | 1: Ad
    stt: { type: Number, default: 0 },
    tt: { type: Date, default: Date.now },
    crt: { type: Date, default: Date.now }
});
// schema.plugin(mongoosePaginate);
// schema.statics.paginate = mongoosePaginate;

module.exports = mongoose.model('posts',  schema);
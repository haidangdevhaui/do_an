var winston = require('winston'),
    config =require('./config.js');

/**
 * Requiring `winston-mongodb` will expose
 * `winston.transports.MongoDB`
 */
require('winston-mongodb').MongoDB;

winston.add(winston.transports.MongoDB, {
    db: config.log.db,
    level: config.log.level,
    collection:'logs'
});

module.exports = winston;

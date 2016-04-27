'use strict'
var gulp = require('gulp') ,
    nodemon = require('gulp-nodemon');

gulp.task('default' , function() {
    nodemon({
        script : 'app.js' ,
        ext : 'js' ,
        ignore: ['client/*.js', 't.js'],
        env : {
            PORT : 2212
        }
    })
        .on('restart' , function() {
            console.log('Restarting...')
        })
});
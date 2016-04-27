 // Invoke 'strict' JavaScript mode
'use strict';

// Set the 'development' environment configuration object
module.exports = {
   port: 3000,
   db: 'mongodb://127.0.0.1:27017/Do_An',
   log: {
      db: 'mongodb://localhost/Do_An',
      level: 'error'
   },

   secret: '4kh8gz3dgzg6k5g5',
   shrink: {
      domain: 'hii.to'
   },
   cookie: {
      domain: '.hii.to'
   },
   report: {
      click: {
         concurrency: 50,
         passOfTime: 6 //thời gian pass 1 click
      },
      type:{
        CAMPAIGN: 'a',
        ADSET: 'b',
        ADV: 'c',
        WEBSITE: 'd',
        WIDGET: 'e',
        GROUP: 'f',
        LINK: 'g',
        COUNTRY: 'h',
        CITY: 'i',
        OS: 'j',
        BROWSER: 'k',
        REFERER: 'l',
        IP: 'm',
        DIVICE: 'o'
      }
   },
   smtp:{
      uid: 'haidangdevhaui@gmail.com',
      api: 'vbCx74ZV9Mc5zBCgB8Z2nw'
   },
   examp: {
    numb: 20,
    pass: 16
   },
   tumblr: {
      clientID: 'sC2hNnCfMHYFh84vEWB6icAuSkFdupIBo1cdrpGMMCPHBvskEP',
      clientSecret: 'ww3bd7R4o5LtOBFvTwnH0MkUx3UMGQuWLrm3LxCUYO5j3vUsuj',
      callbackURL: 'http://localhost:1337/callback'
   },
   facebook: {
      clientID: 'Facebook Application ID',
      clientSecret: 'Facebook Application Secret',
      callbackURL: 'http://localhost:3000/oauth/facebook/callback'
   },
   twitter: {
      clientID: 'Twitter Application ID',
      clientSecret: 'Twitter Application Secret',
      callbackURL: 'http://localhost:3000/oauth/twitter/callback'
   },
   google: {
      clientID: 'Google Application ID',
      clientSecret: 'Google Application Secret',
      callbackURL: 'http://localhost:3000/oauth/google/callback'
   }
};

var mandrill = require('mandrill-api/mandrill');
var mail_config = require('./config').smtp;
module.exports = function(mail, fn, html, subject) {
    var mandrill_client = new mandrill.Mandrill(mail_config.api);
    var arr = [];
    arr.push({
		email: mail.replace("\r", "").replace("\"", "").replace("'", ""),
		name: fn,
		type: "to"
	});
    var message = {
        html: html,
        text: "",
        subject: subject,
        from_email: mail_config.uid,
        from_name: fn,
        to: arr,
        track_clicks: true,
        track_opens: true,
        merge: true
    };
    var async = false;
    mandrill_client.messages.send({
        "message": message,
        "async": async
    }, function(result) {
        console.log(result);
    }, function(e) {
        console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
    });
}
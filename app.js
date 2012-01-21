var express = require('express');
var app = module.exports = express.createServer();
var environment = require('./environment');
var service = require('./service.js');
    service.init(environment);

require('./configuration')(app, express);
require('./controllers.js')(app, service, environment);

//app.listen(process.env.PORT);
app.listen(3000);
console.log('Express server listening on port ' + app.address().port + ' in ' + app.settings.env + ' mode');

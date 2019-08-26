let APP = require('index');
let app = APP.app;

// api routes

app.use('/users', require('../users/users.controller'));
app.use('/account', require('../account/account.controller'));

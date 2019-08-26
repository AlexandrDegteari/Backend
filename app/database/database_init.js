var mysql      = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    multipleStatements: true
});

exports.connection = connection;

connection.connect(function(err) {
    // if we had error throw it
    if (err) throw err;

    connection.query('use companies_server_1;', function(err, result) {
        // throw te error
        if (err) throw err;

        require('./create_database');
    });
});

const config = require('config.json');
const jwt = require('jsonwebtoken');
const passHash = require('_helpers/password_hasher');
const db = require('../database/database_init');
const util = require('util');

const query = util.promisify(db.connection.query).bind(db.connection);

module.exports = {
   logout
};

async function logout(req) {
    try {
        let token = req.headers['authorization'];

        let user = await jwt.decode(token, config.secret);

        jwt.sign({ sub: user[0].id }, config.secret);

        return 'logged out';
    } catch (e) {
        throw new Error(e)
    }
}


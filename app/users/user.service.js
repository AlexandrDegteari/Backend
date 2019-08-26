const config = require('config.json');
const jwt = require('jsonwebtoken');
const passHash = require('_helpers/password_hasher');
const db = require('../database/database_init');
const util = require('util');

const query = util.promisify(db.connection.query).bind(db.connection);

module.exports = {
    authenticate,
    register,
    getAllUsers,
    getUserByName
};

async function authenticate({ email, password }) {

    const userData = new UserData();

    try {
        const hashUser = await userData.getAuthBase(email);
        console.log(hashUser);
        const passHashed = await passHash.checkHash(password, hashUser[0]);

        if (passHashed.passwordHash === hashUser[0].password_hash) {

            const user = await userData.getByEmail(email);

            console.log(user);

            let token = jwt.sign({ sub: user[0].id }, config.secret);
            return {
                user,
                token
            };
        }
    } catch (e) {
        throw new Error(e);
    }
}

async function register({ username, password, email }) {

    const userData = new UserData();

    try {
        const allUsers = await userData.getAll();

        const isUserExist = await allUsers.find(u => u.username === username && u.email === email);

        if (!isUserExist) {
            let insertQuery = `INSERT INTO user (name, email, createdDate) values (?, ?, ?)`;
            let date = new Date();
            date = date.getUTCFullYear() + '-' +
                ('00' + (date.getUTCMonth()+1)).slice(-2) + '-' +
                ('00' + date.getUTCDate()).slice(-2) + ' ' +
                ('00' + date.getUTCHours()).slice(-2) + ':' +
                ('00' + date.getUTCMinutes()).slice(-2) + ':' +
                ('00' + date.getUTCSeconds()).slice(-2);

            let createdUser = await query(insertQuery, [username, email, date]);

            const id = createdUser.insertId;
            const hashedPassword = passHash.saltHashPassword(password);

            insertQuery = `INSERT INTO auth_base (user_id, password_hash, salt) values (?, ?, ?)`;
            query(insertQuery, [id, hashedPassword.passwordHash, hashedPassword.salt]);

            const token = jwt.sign({ sub: id }, config.secret);
            return {
                user: {
                    id,
                    username,
                    email
                },
                token
            };
        }

    } catch (e) {
        throw e
    }
}

async function getAllUsers() {

    const userData = new UserData();

    try {
        return await userData.getAll();
    } catch (e) {
        throw new Error(e);
    }
}

async function getUserByName(name) {

    const userData = new UserData();

    try {
        return await userData.getByName(name);
    } catch (e) {
        throw new Error(e);
    }
}

class UserData {

    async getAll() {
        try {
            return await query(`SELECT * FROM user`);
        } catch (e) {
            throw new Error(e)
        }
    }

    async getByName(name) {
        try {
            return await query(`SELECT * FROM user WHERE user.name = ?`, [name]);
        } catch (e) {
            throw new Error(e)
        }
    }

    async getByEmail(email) {
        try {
            return await query(`SELECT * FROM user WHERE user.email = ?`, [email]);
        } catch (e) {
            throw new Error(e);
        }
    }

    async getAuthBase(email) {
        try {
            const user = await this.getByEmail(email);
            console.log(user, email)
            return await query(`SELECT * FROM auth_base WHERE user_id = ?`, [user[0].id]);
        } catch (e) {
            throw new Error(e);
        }
    }
}
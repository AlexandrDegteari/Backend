const express = require('express');
const router = express.Router();
const userService = require('./user.service');

// routes
router.post('/authenticate', authenticate);
router.post('/register', register);
router.get('/:name', getUserByName);
router.get('/', getAll);

module.exports = router;

function authenticate(req, res, next) {
    userService.authenticate(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'Username or password is incorrect' }))
        .catch(err => next(err));
}

function register(req, res, next) {
    userService.register(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'User already exist!' }))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    userService.getAllUsers()
        .then(user => res.json(user))
        .catch(err => next(err));
}

function getUserByName(req, res, next) {
    userService.getUserByName(req.params.name)
        .then(user => res.json(user))
        .catch(err => next(err));
}
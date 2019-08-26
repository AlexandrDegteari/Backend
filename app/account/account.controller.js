const express = require('express');
const router = express.Router();
const accountService = require('./account.service');

// routes
router.get('/logout', logout);


module.exports = router;

function logout(req, res, next) {
    accountService.logout(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}

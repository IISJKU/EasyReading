/** Express router providing client login related routes
 * @module routers/clientAnonymousLogin
 * @requires express
 */

let express = require('express');
let router = express.Router();

const passport = require("passport");

/**
 * Login with passport
 * @name get/
 * @memberof module:routers/clientAnonymousLogin
 * @param {Request} req Request object that is used for setting session value for passport authenticate
 * @param {Response} res Response object that is used in passport authenticate
 * @param next Next object that is used in passport authenticate
 */
router.get('/', function (req, res, next) {
    req.session.returnTo = "/client/welcome";

    passport.authenticate('anonymId', {
            failureRedirect: '/client/login/anonym',
            keepSessionInfo: true
        }
    )(req, res, next);
});

/**
 * Sending false for anonymous users
 * @name post/
 * @memberof module:routers/clientAnonymousLogin
 * @param {Request} req Not used
 * @param {Response} res Response object that is used for the result
 * @param next Not used
 */
router.post('/', async function (req, res, next) {
    res.send({
        success: false,
    });
});

module.exports = router;
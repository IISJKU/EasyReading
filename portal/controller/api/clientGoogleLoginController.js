/** Express router providing client login related routes
 * @module routers/clientGoogleLogin
 * @requires express
 */

let express = require('express');
let router = express.Router();
const passport = require("passport");

/**
 * Login in through Google with passport
 * @name get/
 * @memberof module:routers/clientAnonymousLogin
 * @param {Request} req Request object that is used for session values for passport authenticate
 * @param {Response} res Response object that is used in passport authenticate
 * @param next Next object that is used in passport authenticate
 */
router.get('/', function(req,res,next){

    if(req.query.token) {
        req.session.returnTo = "/client/welcome";
        req.session._clientToken = req.query.token;
        if(req.session._select_account) {
            passport.authenticate(
                'google',
                { prompt: 'select_account', failureRedirect: '/client/login', keepSessionInfo: true })
            (req,res,next);
        }else{
            passport.authenticate('google', {keepSessionInfo: true })(req,res,next);
        }

    } else if(req.session._clientToken){
        req.session.returnTo = "/client/welcome";
        if(req.session._select_account){
            passport.authenticate(
                'google',
                { prompt: 'select_account', failureRedirect: '/client/login', keepSessionInfo: true })
            (req,res,next);
        }else{
            passport.authenticate('google', {keepSessionInfo: true })(req,res,next);
        }

    }else{
        res.status(404).send('Not found');
    }
});

/**
 * Login in through Google with passport
 * @name post/
 * @memberof module:routers/clientAnonymousLogin
 * @param {Request} req Request object that is used for session values for passport authenticate
 * @param {Response} res Response object that is used in passport authenticate
 * @param next Not used
 */
router.post('/',async function(req,res,next){
    if(req.isAuthenticated() && req.query.token) {
        req.session._clientToken = req.query.token;

        let passportLogin = require("../../passport/passportLogin");

        let loginInfo = {
            loginType: "Google",
            id: req.session.user.googleID,
            email: req.session.user.email,
            locale: req.session.user.locale,
        };
        await passportLogin.userLogin(req, loginInfo, function (profile, error) {

            if (profile) {
                res.send({
                    success: true,
                });

            } else {
                res.send({
                    success: false,
                });
            }
        });
    }else{
        res.send({
            success: false,
        });
    }

});

module.exports = router;
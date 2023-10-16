/** Passport setup 
 * @module routers/passport/setup
 * @requires passport
 */

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const AnonymIdStrategy = require('passport-anonym-uuid').Strategy;
const config = require("../config/config");
let passportLogin = require("./passportLogin");

/**
 * Login anonymous through passport
 * @name get/
 * @memberof module:routers/passport/setup
 * @param {Request} req Request object that is used for session values for passport authenticate
 * @param {object} done Object that is used for returning the reuslt
 * @returns {object} The done object
 */
passport.use(new AnonymIdStrategy(async (req, uuid, done) => {
    let loginInfo = await passportLogin.createLoginInfoAnonym(req, uuid);

    await passportLogin.userLogin(req, loginInfo, function (profile, error) {

        if(!profile){
            return done(null, false, { message: error });
        }

        if(profile.isNewProfile){
            //Delete old setup sessions which could be there due to a websocket disconnect ...
            delete req.session.setupInformation;
            delete req.session.step;

            req.session.returnTo = "/client/setup";
        }
        
        return done(null, profile);
    });
}));

/**
 * Login with Google through passport
 * @name get/
 * @memberof module:routers/passport/setup
 * @param {Request} req Request object that is used for session values for passport authenticate
 * @param {object} accessToken Not used
 * @param {object} refreshToken Not used
 * @param {object} profile Holds the user profile
 * @param {object} done Object that is used for returning the reuslt
 * @returns {object} The done object
 */
passport.use(
    new GoogleStrategy({
        callbackURL: config.google.callbackURL,
        clientID: config.google.clientID,
        clientSecret: config.google.clientSecret,
        scope: config.google.scope,
        passReqToCallback: true,
    }, async (req, accessToken, refreshToken, profile, done) => {
        try {
            let loginInfo = await passportLogin.createLoginInfoGoogle(req, profile);

            await passportLogin.userLogin(req, loginInfo, function (profile, error) {
                if(profile.isNewProfile){
                    //Delete old setup sessions which could be there due to a websocket disconnect ...
                    delete req.session.setupInformation;
                    delete req.session.step;

                    req.session.returnTo = "/client/setup";
                }
                return done(null, profile);
            });
        } catch (err) {
            console.log("error");
        }
    })
);

/**
 * Login with Facebook through passport
 * @name get/
 * @memberof module:routers/passport/setup
 * @param {Request} req Request object that is used for session values for passport authenticate
 * @param {object} accessToken Not used
 * @param {object} refreshToken Not used
 * @param {object} profile Holds the user profile
 * @param {object} done Object that is used for returning the reuslt
 * @returns {object} The done object
 */
let FacebookStrategy = require('passport-facebook').Strategy;
let serverURL = "";
if(process.env.SERVER_URL){
    serverURL = process.env.SERVER_URL;
}
passport.use(new FacebookStrategy({
        clientID: "681162132383572",
        clientSecret: "49b3620d5967fe76f9a04c835f4a5591",
        callbackURL: serverURL+"/client/login/facebook/auth",
        profileFields: ['email'],
        passReqToCallback: true,
        auth_type: "reauthenticate"
    },
    async function (req, accessToken, refreshToken, profile, done) {
        try {
            let loginInfo = await passportLogin.createLoginInfoFacebook(req, profile);

            await passportLogin.userLogin(req, loginInfo, function (profile, error) {

                if(profile.isNewProfile){
                    //Delete old setup sessions which could be there due to a websocket disconnect ...
                    delete req.session.setupInformation;
                    delete req.session.step;
                    req.session.returnTo = "/client/setup";
                }

                return done(null, profile);
            });


        } catch (err) {
            console.log("error");
        }
    }
));

/**
 * Serialize from the user object
 * @memberof module:routers/passport/setup
 * @param {object} user User object
 * @param {object} done Object that is used for returning the reuslt
 * @returns {object} The done object
 */
passport.serializeUser(function (user, done) {
    done(null, user);
});

/**
 * Deserialize to the user object
 * @memberof module:routers/passport/setup
 * @param {object} user User object
 * @param {object} done Object that is used for returning the reuslt
 * @returns {object} The done object
 */
passport.deserializeUser(function (user, done) {
    done(null, user);
});

module.exports = passport;
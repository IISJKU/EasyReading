/** Express router providing client logout route
 * @module routers/clientLogout
 * @requires express
 */

let express = require('express');
let router = express.Router();

/**
 * Logout
 * @name use/
 * @memberof module:routers/clientLogout
 * @param {Request} req Request object that holdes the current user
 * @param {Response} res Response object that is used to redirect after logout
 * @param next Not used
 */
router.use('/', async function(req, res, next) {
    req.session._select_account = true;
    if (req.user) {  // If user is still logged in
        if (req.session._clientToken) {  // If user is logged in as client
            let network = require("../../../core/network/network");
            let webSocketConnection = network.getConnectionWithUUID(req.session._clientToken);
            let token = req.session._clientToken;
            delete req.session._clientToken;
            req.logout(async function(err) {
                if (err) { return next(err); }
                if (webSocketConnection) {
                    await webSocketConnection.logout();
                } else {
                    // In case sticky sessions do not work. User logs in over http but is connected to another instance via websocket
                    // Need to send a message to logout
                    let messageServerConnection = require("../../../core/network/message-server-connection");
                    if (messageServerConnection.isEnabled) {
                        messageServerConnection.sendMessage({
                            type: "userLogoutWebsocket",
                            message: token,
                        });
                    }
                }
                res.redirect("/logout-success");
            });
        } else {  // If user is logged in as caretaker
            req.logout(function(err) {
                if (err) { return next(err); }
                res.redirect('/');
            });
        }
    } else {  //Redirect user to caretaker start page
        res.redirect('/');
    }
});

module.exports = router;
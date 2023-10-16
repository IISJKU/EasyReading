// This application uses express as its web server
// for more info, see: http://expressjs.com
const express = require('express');
const path = require('path');
const hbs = require("./handlebars/hbs-setup");
const passport = require("./passport/passportSetup");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MySQLStore = require('express-mysql-session')(session);
let databaseManager = require("../core/database/database-manager");
let activeConnection = databaseManager.getConnection();

let sessionStore = new MySQLStore({}/* session store options */, activeConnection.connection);

const localeService = require("./../core/i18n/locale-service");

// create a new express server
const app = express();

const multer = require('multer');
const upload = multer();


// Ensure express is looking at our views directory for templates
app.set('views', path.join(__dirname, '..', 'public', 'views'))

app.set('view engine', 'hbs');
hbs.registerPartials(path.join(__dirname, '..', 'public', 'views', 'partials'));


// app.set('view cache', true) // uncomment to cache already rendered views

// Ensure we automatically parse any json-bodies
app.use(express.json());

/*
var simulateLatency = require('express-simulate-latency');
// use as middleware for all subsequent handlers...
var smallLag = simulateLatency({ min: 500, max: 1000 });
app.use(smallLag);
*/

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(session({
    secret: "set this secrect to a config file",
    proxy: true,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    expires: new Date(Date.now() + (30 * 1000 * 60)),
    cookie : {
        sameSite : "none",
        secure: true
    }
}));

app.use(localeService.i18nProvider.init);
app.use(passport.initialize());
app.use(passport.session());
app.use(function (req, res, next) {
    req.connection.setNoDelay(true);
    next();
});




// Serve the files out of ./public as our main files
app.use(express.static(baseDirPath('public')))

// Controllers
const patientController = require("./controller/view/patientController");
const authentication = require("./passport/authentication");
const clientLoginValidator = require("./controller/api/clientLoginValidator");
const clientGoogleLoginController = require("./controller/api/clientGoogleLoginController");
const clientFacebookLoginController = require("./controller/api/clientFacebookLoginController");
const clientAnonymLoginController = require("./controller/api/clientAnonymousLoginController");
const clientLogoutController = require("./controller/api/clientLogoutController");
const clientWelcomeController = require("./controller/view/clientWelcomeViewController");
const caretakerWelcomeController = require("./controller/view/caretakerWelcomeViewController");
const localeController = require("./controller/view/localeController");
const userController = require("./controller/view/userController");
const customFunctionController = require("./controller/api/customFunctionController");
const customFunctionViewController = require("./controller/view/customFunctionView");
const clientCaretakerOverviewController = require("./controller/view/clientCaretakerOverviewController");
const clientCaretakerRegisterController = require("./controller/view/clientCaretakerRegisterController");
const clientBasicSettingsController = require("./controller/view/clientBasicSettingsController");
const caretakerClientOverviewController = require("./controller/view/caretakerClientOverviewController");
const caretakerContentReplacementController = require("./controller/view/caretakerContentReplacementController");
const clientSetupController = require("./controller/view/clientSetupController");
const clientSetupFinishedController = require("./controller/view/clientSetupFinishedController");
const localeProfileWizardController = require("./controller/view/localeProfileWizardController");
const permissionController = require("./controller/view/permissionController");
const caretakerContentReplacementAPIController = require("./controller/api/caretakerContentReplacementAPIController");

const adminCaretakersController = require("./controller/view/adminCaretakersController");
const adminClientsController = require("./controller/view/adminClientsController");
const adminContentReplacementsController = require("./controller/view/adminContentReplacementsController");
const adminBackendUserManagementController = require("./controller/view/adminBackendUserManagementController");
const adminClientManagementController = require("./controller/view/adminClientManagementController");
const adminEmbeddedSiteController = require("./controller/view/adminEmbeddedSiteController");
const embeddedOverviewController = require("./controller/view/embeddedOverviewController");
const uploadFileController = require("./controller/api/uploadFileController");

// Authentication routes
//Caretaker
app.get('/login',clientLoginValidator, userController.setUser, localeController.setLocale, localeController.translateMain, localeController.translateBackEnd, (_, res) => res.render('caretaker_login', res.locals.context));
app.get('/caretaker/login/google',clientLoginValidator, passport.authenticate("google"));
app.get('/caretaker/login/facebook',clientLoginValidator, passport.authenticate("facebook"));
app.get('/auth/callback', passport.authenticate("google", { keepSessionInfo: true }), authentication.redirectToOrigin);
//Client
app.use('/client/login/anonym',clientLoginValidator,clientAnonymLoginController ,authentication.redirectToOrigin);
app.use('/client/login',clientLoginValidator, clientGoogleLoginController);
app.use('/client/login/facebook', clientLoginValidator,clientFacebookLoginController);
app.get('/client/login/facebook/auth', passport.authenticate('facebook', { keepSessionInfo: true }), authentication.redirectToOrigin);
//Logout
app.get('/client/logout', clientLogoutController);



// Index
app.get('/', userController.setUser, localeController.setLocale, localeController.translateMain, localeController.translateBackEnd, localeController.translateClientWelcome, caretakerWelcomeController, (_, res) => res.render('caretaker_welcome', res.locals.context));
app.post('/', userController.setUser, localeController.setLocale, localeController.translateMain, localeController.translateBackEnd, localeController.translateClientWelcome, caretakerWelcomeController, (_, res) => res.render('caretaker_welcome', res.locals.context));

// Function Editor
app.use('/client/function-editor', customFunctionController, (_, res) => res.render('function_editor', res.locals));
app.use('/client/function-overview', customFunctionViewController, (_, res) => res.render('function_view', res.locals));




//Admin
app.use('/admin/backend_user_management', authentication.isAuthenticated, userController.setUser, localeController.setLocale, localeController.translateMain,adminBackendUserManagementController.userManagement, (_, res) => res.render('admin_backend_user_management', res.locals.context));
app.use('/admin/backend_user_edit', authentication.isAuthenticated, userController.setUser, localeController.setLocale, localeController.translateMain,adminBackendUserManagementController.userEdit, (_, res) => res.render('admin_backend_user_edit', res.locals.context));
app.use('/admin/client_management', authentication.isAuthenticated, userController.setUser, localeController.setLocale, localeController.translateMain,adminClientManagementController.clientManagement, (_, res) => res.render('admin_client_management', res.locals.context));
app.use('/admin/client_delete', authentication.isAuthenticated, userController.setUser, localeController.setLocale, localeController.translateMain,adminClientManagementController.clientDelete, (_, res) => res.render('admin_client_delete', res.locals.context));
app.use('/admin/content_replacements', authentication.isAuthenticated, userController.setUser, localeController.setLocale, localeController.translateMain,localeController.translateContentReplacements,adminContentReplacementsController.allContentReplacements, (_, res) => res.render('admin_content_replacements', res.locals.context));
app.post('/admin/delete_content_replacement',  authentication.isAuthenticated, userController.setUser,adminContentReplacementsController.deleteContentReplacement);
app.get('/admin/edit_content_replacement', authentication.isAuthenticated, userController.setUser, localeController.setLocale, localeController.translateMain, localeController.translateContentReplacements, adminContentReplacementsController.getContentReplacementsById, (_, res) => res.render('admin_content_replacements_edit', res.locals.context));
app.post('/admin/edit_content_replacement', adminContentReplacementsController.saveOrUpdateContentReplacement);
app.use('/admin/embedded_sites', authentication.isAuthenticated, userController.setUser, localeController.setLocale, localeController.translateMain,adminEmbeddedSiteController.overview, (_, res) => res.render('admin_embedded_site_overview', res.locals.context));
app.use('/admin/edit_embedded_site', authentication.isAuthenticated, userController.setUser, localeController.setLocale, localeController.translateMain,adminEmbeddedSiteController.editSite, (_, res) => res.render('admin_embedded_create_edit_site', res.locals.context));
app.use('/admin/edit_embedded_profile', authentication.isAuthenticated, userController.setUser, localeController.setLocale, localeController.translateMain,adminEmbeddedSiteController.editProfile, (_, res) => res.render('admin_embedded_edit_profile', res.locals.context));
app.get('/admin/embedded_profile_configure', authentication.isAuthenticated, userController.setUser, localeController.setLocale, localeController.translateMain, localeController.translateConfigure, patientController.getEngineConfigByuserId, (_, res) => res.render('caretaker_client_configure', res.locals.context));
app.post('/admin/embedded_site_delete_profile', authentication.isAuthenticated, adminEmbeddedSiteController.deleteSite);
app.post('/admin/embedded_site_delete_site', authentication.isAuthenticated, adminEmbeddedSiteController.deleteProfile);



// Caretaker
app.get('/caretaker/clients', authentication.isAuthenticated, userController.setUser, localeController.setLocale, localeController.translateMain, localeController.translateClientList, caretakerClientOverviewController, (_, res) => res.render('caretaker_clients', res.locals.context));
app.get('/caretaker/client-configure', authentication.isAuthenticated, userController.setUser, localeController.setLocale, localeController.translateMain, localeController.translateConfigure,permissionController.hasPermission,  patientController.getEngineConfigByuserId, (_, res) => res.render('caretaker_client_configure', res.locals.context));
app.get('/caretaker/custom-paragraphs-overview', authentication.isAuthenticated, userController.setUser, localeController.setLocale, localeController.translateMain, localeController.translateContentReplacements, caretakerContentReplacementController.getContentReplacementsByUserId, (_, res) => res.render('caretaker_content_replacements', res.locals.context));
app.get('/caretaker/custom-paragraph', authentication.isAuthenticated, userController.setUser, localeController.setLocale, localeController.translateMain, localeController.translateContentReplacements, caretakerContentReplacementController.getContentReplacementsById, (_, res) => res.render('caretaker_content_replacements_edit', res.locals.context));
app.post('/caretaker/custom-paragraph', caretakerContentReplacementController.saveOrUpdateContentReplacement);
app.post('/caretaker/custom-paragraphs-action', caretakerContentReplacementController.quickEditContentReplacement);

//Embedded Site
app.use('/embedded/embeddedOverview', authentication.isAuthenticated, userController.setUser, localeController.setLocale, localeController.translateMain,embeddedOverviewController.overview, (_, res) => res.render('embedded_site_overview', res.locals.context));
app.use('/embedded/createEditEmbeddedSite', authentication.isAuthenticated, userController.setUser, localeController.setLocale, localeController.translateMain,embeddedOverviewController.createEditSite, (_, res) => res.render('embedded_create_edit_site', res.locals.context));
app.use('/embedded/createEditEmbeddedProfile', authentication.isAuthenticated, userController.setUser, localeController.setLocale, localeController.translateMain,embeddedOverviewController.createEditProfile, (_, res) => res.render('embedded_create_edit_profile', res.locals.context));
app.post('/embedded/deleteProfile', authentication.isAuthenticated, embeddedOverviewController.deleteProfile);
app.post('/embedded/deleteEmbeddedSite', authentication.isAuthenticated, embeddedOverviewController.deleteSite);
app.get('/embedded/embedded-configure', authentication.isAuthenticated, userController.setUser, localeController.setLocale, localeController.translateMain, localeController.translateConfigure, patientController.getEngineConfigByuserId, (_, res) => res.render('caretaker_client_configure', res.locals.context));
app.post('/post_image/', authentication.isAuthenticated, upload.any(),  uploadFileController.uploadSiteLogo);

// Client
app.use('/client/welcome', authentication.isAuthenticated, userController.setUser, localeController.setLocale, localeController.translateMain, localeController.translateClientWelcome, clientWelcomeController, (_, res) => res.render('client_welcome', res.locals.context));
app.use('/client/privacy-policy', authentication.isAuthenticated, userController.setUser, localeController.setLocale, localeController.translateMain, localeController.translateClientWelcome, (_, res) => res.render('client_privacy_policy', res.locals.context));
app.use('/client/privacy-policy-easy', authentication.isAuthenticated, userController.setUser, localeController.setLocale, localeController.translateMain, localeController.translateClientWelcome, (_, res) => res.render('client_privacy_policy_easy', res.locals.context));
app.use('/client/imprint', authentication.isAuthenticated, userController.setUser, localeController.setLocale, localeController.translateMain, localeController.translateImprint, (_, res) => res.render('client_imprint', res.locals.context));
app.use('/client/setup', authentication.isAuthenticated, userController.setUser,localeController.setLocale, localeProfileWizardController.translateProfileWizard, clientSetupController.setupController);
app.use('/client/finished', authentication.isAuthenticated, userController.setUser,localeController.setLocale,localeProfileWizardController.translateProfileWizard, clientSetupFinishedController.setupFinishedController);

//Content replacements/Caretaker
app.use('/api/v1/content-replacements', authentication.caretakerAPIAuth, userController.setUser, localeController.setLocale, caretakerContentReplacementAPIController);


app.get('/client/configure', authentication.isAuthenticated, userController.setUser, localeController.setLocale, localeController.translateMain, localeController.translateConfigure, patientController.getEngineConfigByuserId, (_, res) => res.render('client_configure', res.locals.context));
app.use('/client/basic-settings', authentication.isAuthenticated, userController.setUser, localeController.setLocale, localeController.translateMain, localeController.translateConfigure, localeController.translateBasicSetting, clientBasicSettingsController, (_, res) => res.render('client_basic_settings', res.locals.context));
//Client Caretaker Management
app.use('/client/caretakers', authentication.isAuthenticated, userController.setUser, localeController.setLocale, localeController.translateMain, localeController.translateCaretakerList, clientCaretakerOverviewController, (_, res) => res.render('client_caretaker_overview', res.locals.context));
app.use('/client/caretaker/register', authentication.isAuthenticated, userController.setUser, localeController.setLocale, localeController.translateMain, localeController.translateConfigure, localeController.translateClientCaretakerRegister, clientCaretakerRegisterController, (_, res) => res.render('client_caretaker_register', res.locals.context));
app.use('/logout-success', (_, res) => res.render('client_caretaker_register', res.locals.context));


// API routes
const egineController = require("./controller/api/engineController");
const profileController = require("./controller/api/profileController");
app.post('/api/v1/configuration',permissionController.hasPermission, egineController.updateEngineConfiguratoin);
app.post('/api/v1/updateUserInterface',permissionController.hasPermission, profileController.updateUserInterface);


app.all('*', function(req, res) {
    if(req.isAuthenticated()) {

        if (req.session._clientToken) {
            //Client logged in with extension
            res.redirect('/client/welcome');
            return;
        }
    }
    res.redirect('/');
});

module.exports = app;
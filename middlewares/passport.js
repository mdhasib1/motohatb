const passport = require('passport');
const authService = require('../services/authService');

module.exports = (app) => {
    app.use(passport.initialize());
    authService(passport);
};

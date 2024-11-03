// authService.js

const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const { Strategy: FacebookStrategy } = require('passport-facebook');
const User = require('../Models/User.model');

module.exports = (passport) => {
    console.log(passport);
    passport.use(new GoogleStrategy({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: 'https://motohat.com/api/google/callback',
        },

        async (accessToken, refreshToken, profile, done) => {

            try {
                let user = await User.findOne({ googleId: profile.id });

                if (user) {
                    return done(null, user);
                } else {
                    const newUser = new User({
                        googleId: profile.id,
                        fullName: profile.displayName,
                        email: profile.emails[0].value,
                        avatar: profile.photos[0].value,
                        isVerified: true,
                    });

                    user = await newUser.save();
                    return done(null, user);
                }
            } catch (error) {
                return done(error, null);
            }
        }));

    // Facebook Strategy
    passport.use(new FacebookStrategy({
            clientID: process.env.FACEBOOK_APP_ID,
            clientSecret: process.env.FACEBOOK_APP_SECRET,
            callbackURL: 'https://motohat.com/api/google/callback',
            profileFields: ['id', 'displayName', 'email', 'photos'],
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                console.log('Facebook strategy triggered');
                let user = await User.findOne({ facebookId: profile.id });

                if (user) {
                    console.log('Existing Facebook user found:', user);
                    return done(null, user);
                } else {
                    const newUser = new User({
                        facebookId: profile.id,
                        fullName: profile.displayName,
                        email: profile.emails[0].value,
                        avatar: profile.photos[0].value,
                        isVerified: true,
                    });

                    user = await newUser.save();
                    console.log('New Facebook user created:', user);
                    return done(null, user);
                }
            } catch (error) {
                console.error('Error in Facebook strategy:', error);
                return done(error, null);
            }
        }));

    // Serialize and Deserialize User
    passport.serializeUser((user, done) => {
        console.log('Serializing user:', user);
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        console.log('Deserializing user with id:', id);
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });
};

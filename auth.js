const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

const GOOGLE_CLIENT_ID = '342076467990-aasn4anlc0rrvvgmjj7b2gj63sfondlt.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '-QbzyaV_dJxzJsoH4efoTE8g';

passport.use(new GoogleStrategy({
    
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback",
    passReqToCallback: true
  },
  function(req,accessToken, refreshToken, profile, done) {
   
      return done(null, profile);
    
  }
));
passport.serializeUser(function(user, done) {
    done(null, user);})
passport.deserializeUser(function(user, done) {
    done(null, user);})
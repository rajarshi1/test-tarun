const LocalStrategy = require('passport-local').Strategy;
const bycrypt = require('bcryptjs');


 function initialize(passport, getUserbyEmail, getUserById) {
    const authenticateUser = async (email, password, done) => {
        const user = getUserbyEmail(email)
        if (user==null) {
            return done(null, false, { message: 'Unknown user' });
        }
        try {
            if(await bycrypt.compare(password, user.password)){
                return done(null, user);

            } else {
                return done (null, false, { message: 'Invalid password' });}
            
        } catch (e) {
            return done(e);
            
        }
    }
    passport.use(new LocalStrategy({usernameField: 'email'}, authenticateUser))
    passport.serializeUser((user,done)=>done(null,user.id))
    passport.deserializeUser((id, done) => {
        return done(null, getUserById(id))
      })

}

module.exports = initialize;
 


const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/adminSchema');
const bcrypt = require('bcrypt');



module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'userName' }, (userName, password, done) => {
      // Find user
      console.log(userName)
      User.findOne({ userName: userName })
        .then(user => {
          if (!user) {
            return done(null, false, { message: 'That email is not registered' });
          }

          // Match password
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, { message: 'Password incorrect' });
            }
          });
        })
        .catch(err => console.log(err));
    })
  );


  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  
  passport.deserializeUser((id, done) => {
    User.findById(id)
        .then(user => {
            done(null, user);
        })
        .catch(err => {
            done(err, null);
        });
});

};

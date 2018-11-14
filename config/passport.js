const JWTStrategy = require("passport-jwt").Strategy;
const ExtractStrategy = require("passport-jwt").ExtractJwt;

const mongoose = require("mongoose");
const User = mongoose.model("users");
const keys = require("./keys");

const opts = {};
opts.jwtFromRequest = ExtractStrategy.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = passport => {
  passport.use(
    new JWTStrategy(opts, (jwt_payload, done) => {
      console.log(jwt_payload);
      User.findOne({ email: jwt_payload.email })
        .then(user => {
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        })
        .catch(err => console.log(err));
    })
  );
};

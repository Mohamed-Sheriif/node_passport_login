const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("../models/User");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          // Match User
          const usr = await User.findOne({ email: email });
          if (!usr) {
            return done(null, false, {
              message: "That email is not registered",
            });
          }

          // Math password
          const match = await bcrypt.compare(password, usr.password);
          if (!match) {
            return done(null, false, { message: "Password incorrect" });
          } else {
            return done(null, usr);
          }
        } catch (error) {
          console.error(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};

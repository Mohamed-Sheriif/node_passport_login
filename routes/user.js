const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const passport = require("passport");

const { isEmailValid } = require("../helpers/helpers");

// @Desc     Login Page
// @Route    GET  /user/login
router.get("/login", (req, res) => {
  res.render("login");
});

// @Desc     Register Page
// @Route    GET  /user/register
router.get("/register", (req, res) => {
  res.render("register");
});

// @Desc     Register handler
// @Route    POST  /user/register
router.post("/register", async (req, res) => {
  const { name, email, password, password2 } = req.body;
  const errors = [];

  // Check required fields
  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Please fill in all fields!" });
  }

  // Check email  valid
  if (!isEmailValid(email)) {
    errors.push({ msg: "Email not valid!" });
  }

  // Check password match
  if (password !== password2) {
    errors.push({ msg: "Passwords do not match!" });
  }

  // Check passwprd length
  if (password.length < 6) {
    errors.push({ msg: "Password should be at least 6 characters!" });
  }

  if (errors.length > 0) {
    res.render("register", {
      errors,
      email,
      name,
      password,
      password2,
    });
  } else {
    const usr = await User.findOne({ email: email });
    if (usr) {
      errors.push({ msg: "Email is already registered" });
      res.render("register", {
        errors,
        email,
        name,
        password,
        password2,
      });
    } else {
      const newUser = new User({ name, email, password });

      // Hashing password
      newUser.password = bcrypt.hashSync(password, 10);
      // Save user
      newUser.save();
      // Flash messages
      req.flash("success_msg", "You are now registered and can login");

      res.redirect("/users/login");
    }
  }
});

// @Desc     Login handle
// @Route    POST  /user/login
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next);
});

// @Desc     Logout handle
// @Route    POST  /users/logout
router.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) return next(err);
    req.flash("success_msg", "You are logged out");
    res.redirect("/users/login");
  });
});

module.exports = router;

const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const connectDB = require("./config/connectDB");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");

const app = express();
const PORT = process.env.PORT || 5000;

// Passport config
require("./config/passport")(passport);

// Dotenv configiration
require("dotenv").config({ path: "./config/config.env" });

// Connect to database
connectDB();

// EJS
app.use(expressLayouts);
app.set("view engine", "ejs");

// Bodt parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Express session
app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true,
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

//Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

// Routes
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/user"));

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

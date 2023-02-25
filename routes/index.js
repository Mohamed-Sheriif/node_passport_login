const router = require("express").Router();
const { ensureAuth } = require("../helpers/helpers");

// @Desc     Welcome page
// @Route    GET  /
router.get("/", (req, res) => {
  res.render("welcome");
});

// @Desc     Dashboard page
// @Route    GET  /dashboard
router.get("/dashboard", ensureAuth, (req, res) => {
  res.render("dashboard", {
    name: req.user.name,
  });
});

module.exports = router;

const express = require("express");
const router = express.Router();

//@route       GET api/users
//@description Test route
// @access     Public
router.get("/", (req, res) => res.send("Profile route"));

//We need to export the route
module.exports = router;
const express = require("express");
const router = express.Router();
const auth = require('../../middleware/auth');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("config");
const { check, validationResult } = require("express-validator");

//@route       GET api/auth
//@description Test route
// @access     Public

//you can add the auth as an extra parameter
router.get("/", auth, async (req, res) => {
    //We want to return info about the user

    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//@route       POST api/auth
//@description Authenticate user and get token
// @access     Public
router.post(
    "/",
    [
      check("email", "Please include a valid email").isEmail(),
      check(
        "password",
        "Password is required"
      ).exists(),
    ],
  
    //we're doing async await
    async (req, res) => {
      //Because this is the object of data that is going to be sent to this route
      //In order for this to work, we have to initialize the middleware for the  body parser
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() }); //Because we don't want to send a 200 we want to send a 400 which is a bad request
        //Gives an array of errors
      }
  
      const { email, password } = req.body;
  
      try {
        //See if user exists (if it does, send an error)
        let user = await User.findOne({ email });
        if (!user) {
          //if the user already exists
          return res
            .status(400)
            .json({ errors: [{ msg: "Invalid Credentials" }] });
        }

          const isMatch = await bcrypt.compare(password, user.password);

          if (!isMatch) {
              return res
                  .status(400)
              .json({errors: [{msg: 'Invalid Credentials'}]})
          }
  
        const payload = {
          user: {
            id: user.id
          }
        };
  
        //the payload includes the username and information about the user.
        jwt.sign(
          payload,
          config.get("jwtSecret"),
          { expiresIn: '5 days' },
          (err, token) => {
            if (err) throw err;
            res.json({ token });
          }
        );
  
        //Server error
      } catch (err) {
        console.error(err.message); //So we can see it in the console
        res.status(500).send("Server Error");
      }
    }
  );

//We need to export the route
module.exports = router;
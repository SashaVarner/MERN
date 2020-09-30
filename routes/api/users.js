const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
//Required for the jsonwebtoken secret that I created
const { check, validationResult } = require("express-validator");
const normalize = require("normalize-url");

//This is our user model
//We go up two levels up to models
const User = require("../../models/User");

//@route       POST api/users
//@description Register User
// @access     Public
router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(), //Also validates empty strings
    check("email", "Please include valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
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

    const { name, email, password } = req.body;

    try {
      //See if user exists (if it does, send an error)
      let user = await User.findOne({ email });
      if (user) {
        //if the user already exists
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }

      //Get users gravatar based on their email

      const avatar = gravatar.url(email, {
        s: "200", //size
        r: "pg", //pg rating
        d: "mm",
      });

      //create an instance of a user
      user = new User({
        name,
        email,
        avatar,
        password,
      });

      //Encrypt password
      //This requires bcrypt
      const salt = await bcrypt.genSalt(10);
      //the 10 is the "rounds" the more you have the more secure the password is
      user.password = await bcrypt.hash(password, salt);

      //saves it to the database!!!
      await user.save();

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

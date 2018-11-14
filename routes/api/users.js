const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const gravatar = require("gravatar");
const jsonwebtoken = require("jsonwebtoken");
const secret = require("../../config/keys").secretOrKey;
const passport = require("passport");
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// get - public
router.get("/test", (req, res) => res.json({ Msg: "users test called" }));

// post
// register: public
router.post("/register", (req, res) => {
  // validation
  const { errors, isValid } = validateRegisterInput(req.body);
  if (!isValid) return res.status(400).json(errors);

  User.findOne({ email: req.body.email }).then(user => {
    if (!user) {
      const avatar = gravatar.url(req.body.avatar, {
        s: "200",
        r: "pg",
        d: "mm"
      });

      // new user object
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        avatar: avatar
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(() => res.json(newUser))
            .catch(err => console.log(err));
        });
      });
    } else {
      res.status(400).json({ email: "email already exists" });
    }
  });
});

// post
// login: public
router.post("/login", (req, res) => {
  // validation
  const { errors, isValid } = validateLoginInput(req.body);
  if (!isValid) return res.status(400).json(errors);

  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      errors.email = "email does not exist";
      return res.status(404).json(errors);
    }

    bcrypt.compare(req.body.password, user.password).then(isMatch => {
      if (isMatch) {
        // return token
        const payload = {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar
        };

        jsonwebtoken.sign(
          payload,
          secret,
          { expiresIn: 5000 },
          (err, token) => {
            if (err) {
              return res.status(500);
              console.log(err);
            }
            return res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        errors.password = "incorrect password";
        return res.status(400).json(errors);
      }
    });
  });
});

//get - private - uses jwt
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) =>
    res.json({ id: req.user.id, name: req.user.name, email: req.user.email })
);

module.exports = router;

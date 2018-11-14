const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const validateInputProfile = require("../../validation/profile");

const Profile = require("../../models/Profile");
const User = require("../../models/User");
const errors = {};

router.get("/test", (req, res) => res.json({ Msg: "profile test called" }));

// profile route: private returns profile based on jwt token
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .populate("user", ["name", "avatar"])
      .then(profile => {
        if (profile) {
          res.json(profile);
        } else {
          errors.noprofilefound = "No profile found for this user";
          res.status(404).json(errors);
        }
      })
      .catch(err => res.status(404).json(err));
  }
);

// get all profiles
router.get("/all", (req, res) => {
  const errors = {};
  Profile.find({})
    //.populate("users", ["name", "avatar"])
    .then(profiles => {
      if (!profiles || profiles.length == 0) {
        errors.noprofile = "There are no profiles";
        return res.status(404).json(errors);
      }

      res.json(profiles);
    })
    .catch(err => res.status(404).json({ profile: "There are no profiles" }));
});

// get profile by handle
router.get("/handle/:handle", (req, res) => {
  const errors = {};
  Profile.find({ handle: req.params.handle })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There is no profile with this handle";
        return res.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

// get profile by id
router.get("/user/:user_id", (req, res) => {
  const errors = {};
  Profile.find({ handle: req.params.user_id })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There is no profile with this userid";
        return res.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch(err =>
      res.status(404).json({ profile: "There is no user with this user id" })
    );
});

// profile route: public returns profile based on jwt token
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // validation
    const { errors, isValid } = validateInputProfile(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.user.handle = req.body.handle;
    if (req.body.company) profileFields.user.company = req.body.company;
    if (req.body.website) profileFields.user.website = req.body.website;
    if (req.body.location) profileFields.user.location = req.body.location;
    if (req.body.bio) profileFields.user.bio = req.body.bio;
    if (req.body.status) profileFields.user.status = req.body.status;
    if (req.body.githubusername)
      profileFields.user.githubusername = req.body.githubusername;

    if (typeof req.body.skills !== "undefined") {
      profileFields.skills = req.body.skills.split(",");
    }

    profileFields.social = {};
    if (req.body.youtube) profileFields.user.youtube = req.body.youtube;
    if (req.body.linkedin) profileFields.user.linkedin = req.body.linkedin;
    if (req.body.facebook) profileFields.user.facebook = req.body.facebook;
    if (req.body.twitter) profileFields.user.twitter = req.body.twitter;
    if (req.body.instagram) profileFields.user.instagram = req.body.instagram;

    Profile.findOne({ user: req.user.id })
      .then(profile => {
        // update
        if (profile) {
          Profile.findOneAndUpdate(
            { user: req.user.id },
            { $set: profileFields },
            { new: true }
          ).then(profile => res.json(profile));
        } else {
          // create

          Profile.findOne({ handle: profileFields.handle }).then(profile => {
            if (profile) {
              errors.hanle = "handle already exist";
              res.status(400).json(errors);
            }

            new Profile(profileFields)
              .save()
              .then(profile => res.json(profile));
          });
        }
      })
      .catch(err => res.status(404).json(err));
  }
);

module.exports = router;

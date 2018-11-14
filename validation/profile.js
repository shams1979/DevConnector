const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateProfileInput(data) {
  let errors = {};

  data.handle = isEmpty(data.handle) ? "" : data.handle;
  data.status = isEmpty(data.status) ? "" : data.status;
  data.skills = isEmpty(data.skills) ? "" : data.skills;
  //data.password2 = isEmpty(data.password2) ? "" : data.password2;

  if (!Validator.isLength(data.handle, { min: 2, max: 40 })) {
    errors.handle = "Handle should be min 2 and max 40 characters long";
  }

  if (Validator.isEmpty(data.handle)) {
    errors.handle = "Profile Handle cannot be empty";
  }

  if (Validator.isEmpty(data.status)) {
    errors.status = "Status cannot be empty";
  }

  if (!isEmpty(data.website)) {
    if (!Validator.isURL(data.website)) {
      errors.website = "Not a valid url";
    }
  }

  if (!isEmpty(data.youtube)) {
    if (!Validator.isURL(data.youtube)) {
      errors.youtube = "Not a valid url";
    }
  }

  if (!isEmpty(data.facebook)) {
    if (!Validator.isURL(data.facebook)) {
      errors.facebook = "Not a valid url";
    }
  }

  if (!isEmpty(data.linkedin)) {
    if (!Validator.isURL(data.linkedin)) {
      errors.linkedin = "Not a valid url";
    }
  }

  if (!isEmpty(data.instagram)) {
    if (!Validator.isURL(data.instagram)) {
      errors.instagram = "Not a valid url";
    }
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

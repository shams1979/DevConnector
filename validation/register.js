const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateRegisterInput(data) {
  let errors = {};

  data.name = isEmpty(data.name) ? "" : data.name;
  data.email = isEmpty(data.email) ? "" : data.email;
  data.password = isEmpty(data.password) ? "" : data.password;
  data.password2 = isEmpty(data.password2) ? "" : data.password2;

  if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = "name should be min 2 and max 30 characters long";
  }

  if (Validator.isEmpty(data.name)) {
    errors.name = "name cannot be empty";
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = "email cannot be empty";
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = "Invalid email address";
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = "password cannot be empty";
  }

  if (!Validator.isLength(data.password, { min: 2, max: 6 })) {
    errors.password = "password should be min 2 and max 6 characters long";
  }

  if (Validator.isEmpty(data.password2)) {
    errors.password2 = "password cannot be empty";
  }

  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = "passwords must must";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

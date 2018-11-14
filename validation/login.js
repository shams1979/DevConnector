const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateLoginInput(data) {
  let errors = {};

  data.email = isEmpty(data.email) ? "" : data.email;
  data.password = isEmpty(data.password) ? "" : data.password;

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

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

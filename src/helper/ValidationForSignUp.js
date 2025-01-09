const validator = require("validator");
const User = require("../models/user");
const trimObjectValues = require("../helper/TrimObjValues") ;
const validateSignUp = async (req) => {

  const {
    firstName = "",
    lastName = "",
    emailId = "",
    password = "",
    gender = "",
    dateOfBirth = "",
  } = trimObjectValues(req?.body);

  const acceptedGenders = ["male", "female", "others"];
  const todayDate = new Date();
  const minAge = 18;

    // Check if user already exists
    const existingUser = await User.findOne({ emailId: emailId });
    if (existingUser) {
      throw new Error("User already exists.");
    }
    
  // Validating Date of Birth
  if (!dateOfBirth) {
    throw new Error("Date of Birth is required.");
  }

  const birthDate = new Date(dateOfBirth);
  if (isNaN(birthDate.getTime())) {
    throw new Error("Invalid Date of Birth format.");
  }

  const age = todayDate.getFullYear() - birthDate.getFullYear();
  const monthDiff = todayDate.getMonth() - birthDate.getMonth();
  const isBirthdayPassed =
    monthDiff > 0 ||
    (monthDiff === 0 && todayDate.getDate() >= birthDate.getDate());

    if (
      birthDate >= todayDate ||
    age < minAge ||
    (age === minAge && !isBirthdayPassed)
  ) {
    throw new Error("You must be at least 18 years old.");
  }

  // Validating First Name
  if (
    !firstName ||
    firstName.length < 4 ||
    firstName.length > 20
  ) {
    throw new Error("First Name must be between 4 and 20 characters.");
  }

  // Validating Last Name
  if (
    !lastName ||
    lastName.length < 2 ||
    lastName.length > 20
  ) {
    throw new Error("Last Name must be between 2 and 20 characters.");
  }

  // Validating Email
  if (!validator.isEmail(emailId)) {
    throw new Error(`Invalid Email: ${emailId}`);
  }

  // Validating Password Strength
  if (!validator.isStrongPassword(password)) {
    throw new Error(
      "Password must be strong (at least 8 characters, including uppercase, lowercase, number, and symbol)."
    );
  }
  
  // Validating Gender
  if (
    !gender ||
    !acceptedGenders.includes(gender.toLowerCase())
  ) {
    throw new Error(
      "Invalid Gender. Accepted values are: male, female, others."
    );
  }


};

module.exports = validateSignUp;

const validator = require("validator");
const User = require("../models/user");

const validateSignUp = async (req,res) => {
  const {
    firstName = "",
    lastName = "",
    emailId = "",
    password = "",
    gender = "",
    dateOfBirth = "",
  } = req.body;

  const acceptedGenders = ["male", "female", "others"];
  const todayDate = new Date();
  const minAge = 18;
  const trimmedFirstName = firstName.trim();
  const trimmedLastName = lastName.trim();
  const trimmedEmailId = emailId.trim();
  const trimmedPassword = password.trim();
  const trimmedGender = gender.trim();
  const trimmedDateOfBirth = dateOfBirth.trim();


    // Check if user already exists
    const existingUser = await User.findOne({ emailId: trimmedEmailId });
    if (existingUser) {
      throw new Error("User already exists.");
    }
    
  // Validating Date of Birth
  if (!trimmedDateOfBirth) {
    throw new Error("Date of Birth is required.");
  }

  const birthDate = new Date(trimmedDateOfBirth);
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
    !trimmedFirstName ||
    trimmedFirstName.length < 4 ||
    trimmedFirstName.length > 20
  ) {
    throw new Error("First Name must be between 4 and 20 characters.");
  }

  // Validating Last Name
  if (
    !trimmedLastName ||
    trimmedLastName.length < 2 ||
    trimmedLastName.length > 20
  ) {
    throw new Error("Last Name must be between 2 and 20 characters.");
  }

  // Validating Email
  if (!validator.isEmail(trimmedEmailId)) {
    throw new Error(`Invalid Email: ${trimmedEmailId}`);
  }

  // Validating Password Strength
  if (!validator.isStrongPassword(trimmedPassword)) {
    throw new Error(
      "Password must be strong (at least 8 characters, including uppercase, lowercase, number, and symbol)."
    );
  }
  
  // Validating Gender
  if (
    !trimmedGender ||
    !acceptedGenders.includes(trimmedGender.toLowerCase())
  ) {
    throw new Error(
      "Invalid Gender. Accepted values are: male, female, others."
    );
  }


};

module.exports = validateSignUp;

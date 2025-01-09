const validate = require("validator");
const validateForUpdateUser = async (req) => {
  const {
    firstName,
    lastName,
    gender,
    dateOfBirth,
    location,
    interests,
    profilePicture,
    bio,
  } = req?.body;

  const acceptedGenders = ["male", "female", "others"];
  const todayDate = new Date();
  const minAge = 18;

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

  if (firstName.length < 4 || firstName.length > 20) {
    throw new Error("First Name must be between 4 and 20 characters.");
  }

  if (lastName.length < 2 || lastName.length > 20) {
    throw new Error("Last Name must be between 2 and 20 characters.");
  }

  if (!acceptedGenders.includes(gender.toLowerCase())) {
    throw new Error(
      "Invalid Gender. Accepted values are: male, female, others."
    );
  }
  if (!validate.isURL(profilePicture)) {
    throw new Error("Valid profile picture Needed");
  }
};

module.exports = validateForUpdateUser;

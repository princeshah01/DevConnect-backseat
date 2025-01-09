const validate = require("validator");

const validateForUpdateUser = async (req) => {
  const allowedUpdates = [
    "firstName",
    "lastName",
    "gender",
    "dateOfBirth",
    "location",
    "interests",
    "profilePicture",
    "bio",
  ];

  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedUpdates.includes(field)
  );

  if (!isEditAllowed) {
    throw new Error(
      "Invalid edit request. Only allowed fields can be updated."
    );
  }

  const acceptedGenders = ["male", "female", "others"];
  const todayDate = new Date();
  const minAge = 18;

  const birthDate = new Date(req.body.dateOfBirth);
  if (req?.body?.dateOfBirth && isNaN(birthDate.getTime())) {
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

  if (req?.body?.firstName && (req.body.firstName.length < 4 || req.body.firstName.length > 20)) {
    throw new Error("First Name must be between 4 and 20 characters.");
  }

  if (req?.body?.interests && req.body.interests.length > 10) {
    throw new Error("No more than 10 interests allowed.");
  }

  if (req?.body?.lastName && (req.body.lastName.length < 2 || req.body.lastName.length > 20)) {
    throw new Error("Last Name must be between 2 and 20 characters.");
  }

  if (
    req?.body?.gender &&
    !acceptedGenders.includes(req?.body?.gender.toLowerCase())
  ) {
    throw new Error(
      "Invalid Gender. Accepted values are: male, female, others."
    );
  }

  if (req?.body?.profilePicture && !validate.isURL(req.body.profilePicture)) {
    throw new Error("A valid profile picture URL is required.");
  }
};

module.exports = validateForUpdateUser;

const Users = require("./../models/users.models");
const AppError = require("./../utils/appError.utils");
const { errorCodes } = require("./../utils/constants.utils");

async function updateUser(userId, name, email, contact) {
  const user = await Users.findById(userId);
  //the email and contact should be unique
  const users = await Users.find({ $or: [{ email }, { contact }] });
  if (users) {
    throw new AppError(
      "Email or Contact already exists",
      403,
      errorCodes.EMAIL_OR_CONTACT_ALREADY_EXISTS
    );
  }
  
  const updatedUser = await Users.findByIdAndUpdate(
    userId,
    {
      name: name || user.name,
      email: email || user.email,
      contact: contact || user.contact,
    },
    { new: true }
  );
  return updatedUser;
}

async function getUser(userId) {
  const user = await Users.findById(userId);
  const userWithoutPassword = user.toObject();
  delete userWithoutPassword.password;
  return userWithoutPassword;
}

module.exports = {
  updateUser,
  getUser,
};

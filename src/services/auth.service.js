const User = require("./../models/users.models");
const { generateTokens } = require("./../utils/generateToken.utils");
const bcrypt = require("bcrypt");

async function createUser(name, email, contact, password) {
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);
  const newUser = new User({
    name,
    email,
    contact,
    password: hashPassword,
    userCreatedAt: Date.now(),
  });

  const savedUser = await newUser.save();

  const { accessToken } = await generateTokens(savedUser);

  const userWithoutPassword = savedUser.toObject();
  delete userWithoutPassword.password;

  await User.updateOne(
    { _id: savedUser._id },
    {
      $set: {
        accessToken: accessToken,
        accessTokenCreatedAt: Date.now(),
      },
    }
  );

  return { user: userWithoutPassword, accessToken };
}

module.exports = {
  createUser,
};

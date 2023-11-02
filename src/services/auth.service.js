const Users = require("./../models/users.models");
const { generateTokens } = require("./../utils/generateToken.utils");
const AppError = require("./../utils/appError.utils");
const { errorCodes } = require("./../utils/constants.utils");
const bcrypt = require("bcrypt");

async function createUser(name, email, contact, password) {
  //checking email and contact already exists or not
  const existingUser = await Users.findOne({
    $or: [{ email: email }, { contact: contact }],
  });

  if (existingUser) {
    if (existingUser.email === email) {
      throw new AppError(
        "Email is already in use",
        412,
        errorCodes.EMAIL_ALREADY_EXISTS
      );
    } else if (existingUser.contact === contact) {
      throw new AppError(
        "Contact is already in use",
        412,
        errorCodes.CONTACT_ALREADY_EXISTS
      );
    }
  }

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);
  const newUser = new Users({
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

  await Users.updateOne(
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

async function loginUser(email, password) {
  const user = await Users.findOne({ email: email });
  if (!user) {
    throw new AppError(
      "Invalid email or password",
      401,
      errorCodes.INVALID_EMAIL_OR_PASSWORD
    );
  }

  const verifiedPassword = await bcrypt.compare(password, user.password);

  if (!verifiedPassword) {
    throw new AppError(
      "Invalid username or password",
      401,
      errorCodes.INVALID_EMAIL_OR_PASSWORD
    );
  }

  const { accessToken } = await generateTokens(user);

  await Users.updateOne(
    { _id: user._id },
    {
      $set: {
        accessToken: accessToken,
        accessTokenCreatedAt: Date.now(),
      },
    }
  );
  
  return { userId: user._id, accessToken };
}

async function logoutUser(accessToken) {
  const user = await Users.findOne({ accessToken: accessToken });
  if (!user) {
    throw new AppError("Invalid access token", 401, errorCodes.INVALID_TOKEN);
  }

  await Users.updateOne(
    { _id: user._id },
    {
      $set: {
        accessToken: null,
        accessTokenCreatedAt: null,
      },
    }
  );

  return { userId: user._id };
}

module.exports = {
  createUser,
  loginUser,
  logoutUser,
};

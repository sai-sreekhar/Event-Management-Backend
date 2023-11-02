const AppError = require("./../utils/appError.utils");
const catchAsync = require("./../utils/catchAsync.utils");
const { errorCodes } = require("./../utils/constants.utils");
const { signupBodyValidation } = require("./../validations/signup.validations");
const { loginBodyValidation } = require("./../validations/login.validations");
const { createUser, loginUser } = require("../services/auth.service");

exports.signup = catchAsync(async (req, res, next) => {
  const { error } = signupBodyValidation(req.body);
  if (error) {
    throw new AppError(
      error.details[0].message,
      400,
      errorCodes.INPUT_PARAMS_INVALID
    );
  }

  const { user, accessToken } = await createUser(
    req.body.name,
    req.body.email,
    req.body.contact,
    req.body.password
  );

  res.status(201).json({
    status: "success",
    data: {
      message: "User created successfully",
      user,
      accessToken,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { error } = loginBodyValidation(req.body);
  if (error) {
    throw new AppError(
      error.details[0].message,
      400,
      errorCodes.INPUT_PARAMS_INVALID
    );
  }

  const { userId, accessToken } = await loginUser(
    req.body.email,
    req.body.password
  );

  res.status(200).json({
    status: "success",
    data: {
      message: "Logged in successfully",
      userId,
      accessToken,
    },
  });
});
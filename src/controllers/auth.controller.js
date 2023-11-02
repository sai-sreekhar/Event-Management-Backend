const Users = require("./../models/users.models");
const AppError = require("./../utils/appError.utils");
const catchAsync = require("./../utils/catchAsync.utils");
const { errorCodes } = require("./../utils/constants.utils");
const { signUpBodyValidation } = require("./../validations/signup.validations");
const { createUser } = require("../services/auth.service");

exports.signup = catchAsync(async (req, res, next) => {
  const { error } = signUpBodyValidation(req.body);
  if (error) {
    return next(
      new AppError(
        error.details[0].message,
        400,
        errorCodes.INPUT_PARAMS_INVALID
      )
    );
  }

  //checking email and contact
  const existingUser = await Users.findOne({
    $or: [{ email: req.body.email }, { contact: req.body.contact }],
  });

  if (existingUser) {
    if (existingUser.email === req.body.email) {
      return next(
        new AppError("Email is already in use", 412, errorCodes.EMAIL_ALREADY_EXISTS)
      );
    } else if (existingUser.contact === req.body.contact) {
      return next(
        new AppError(
          "Contact is already in use",
          412,
          errorCodes.CONTACT_ALREADY_EXISTS
        )
      );
    }
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

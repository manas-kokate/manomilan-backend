import userModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import sendMail from "../utils/mail.js";
import jwt from "jsonwebtoken";
import envCredentials from "../config/env.js";



export const registerUser = async (req, res) => {
  try {
    const {
      // Login credentials
      loginEmail,
      loginNumber,
      password,
      CreatedBy,
      franchiseUnder,

      // Personal Info
      firstName,
      lastName,
      midname,
      gender,
      dob,
      timeOfBirth,
      placeOfBirth,
      maritalStatus,
      children,
      height,
      occupation,
      monthlyIncome,
      nationality,
      caste,
      motherTongue,
      divyang,
      mothersName,
      fathersName,
      mamkul,
      parentsResidence,
      parentsCity,
      parentsContact,
      whatsApp,
      alternateNumber,
      brothersCount,
      brothers,
      sisters,
      sistersExactCount,
      otherInfo,

      // Education & Career
      education,
      companyName,
      designation,
      candidateNumber,
      candidateEmail,
      workLocation,
      isWorking,

      // Expectations
      ageFrom,
      ageTo,
      heightFrom,
      heightTo,
      expectedEducation,
      expectedOccupation,
      expectedIncome,
      workAbroad,
      expectedMaritalStatus,
      expectedNationality,
      childAccepted,
      religion,
      nativeLocation,
      workingLocation,

      // Special Info
      sect,
      manglik,
      gotra,
      foodPreference,
      specs,
      bloodGroup,
    } = req.body;

    if (!loginEmail ||
      !loginNumber ||
      !password ||
      !CreatedBy ||
      !franchiseUnder) {
      return res.send({ status: false, message: "Login credentials required to register" })
    }

    // Check if user already exists by email or number
    const existingUser = await userModel.findOne({
      $or: [{ loginEmail }, { loginNumber }]
    });

    if (existingUser) {
      return res.status(400).send({
        status: false,
        message: "User already exists with this email or number.",
      });
    }

    // Handle profile pic
    let userPhoto = '';
    try {
      if (req.files?.profilePic || req.files.profilePic.length !== 0) {
        userPhoto = req.files.profilePic[0].filename
      }
    } catch (err) {
      userPhoto = '';
    }

    const LastIdUser = await userModel.findOne().sort({ UserId: -1 });
    const UserId = LastIdUser ? Number(LastIdUser.UserId) + 1 : 1;

    // Create user document
    const user = new userModel({
      // Login credentials
      UserId,
      loginEmail,
      loginNumber,
      password,
      CreatedBy,
      franchiseUnder,

      // Personal Info
      firstName,
      lastName,
      midname,
      gender,
      dob,
      timeOfBirth,
      placeOfBirth,
      maritalStatus,
      children,
      height,
      occupation,
      monthlyIncome,
      nationality,
      caste,
      motherTongue,
      divyang,
      mothersName,
      fathersName,
      mamkul,
      parentsResidence,
      parentsCity,
      parentsContact,
      whatsApp,
      alternateNumber,
      brothersCount,
      brothers,
      sisters,
      sistersExactCount,
      otherInfo,

      // Education & Career
      education,
      companyName,
      designation,
      candidateNumber,
      candidateEmail,
      workLocation,
      isWorking,

      // Expectations
      ageFrom,
      ageTo,
      heightFrom,
      heightTo,
      expectedEducation,
      expectedOccupation,
      expectedIncome,
      workAbroad,
      expectedMaritalStatus,
      expectedNationality,
      childAccepted,
      religion,
      nativeLocation,
      workingLocation,

      // Special Info
      sect,
      manglik,
      gotra,
      foodPreference,
      specs,
      bloodGroup,
    });

    await user.save();

    return res.status(201).send({
      status: true,
      message: "User registered successfully.",
    });

  } catch (error) {
    console.error("Registration Error:", error);
    return res.status(500).send({
      status: false,
      message: "Server Error",
      // error: error.message,
    });
  }
};

export const login = async (req, res) => {
  const { emailOrNum, password } = req.body;

  if (!emailOrNum || !password) {
    return res.send({
      status: false,
      message: "Invalid Credentials. All Fields Required.",
    });
  }

  try {
    let findUser = await userModel.findOne({ loginEmail: emailOrNum });
    if (!findUser) {
      findUser = await userModel.findOne({ loginNumber: emailOrNum });
      if (!findUser) {
        return res.send({
          status: false,
          message: "User Not Found. Check username and password again",
        });
      }
    }

    const PasswordValidate = await bcrypt.compare(password, findUser.password);

    if (!PasswordValidate) {
      return res.send({ status: false, message: "Wrong Password" });
    }

    const token = jwt.sign(
      { id: findUser._id },
      envCredentials.secretKey,
      { expiresIn: "1h" }
    );

    res.send({
      status: true,
      success: true,
      message: "User Logged in successfully",
      token: token,
    });
  } catch (error) {
    return res.send({ status: false, message: "Server Error" });
  }
};



export const editProfile = async (req, res) => {
  const { newUpdates } = req.body;
  const userId = req.id
  if (!newUpdates) {
    return res.send({ status: false, message: "No data found to update" })
  }

  const ExistingUser = await userModel.findOne({ _id: req.id });
  if (!ExistingUser) {
    return res.send({ status: false, message: "Something went wrong user not found." })
  }

  const update = await userModel.findByIdAndUpdate(userId, newUpdates);

  const finUpdatedUser = await userModel.findById(userId, '-_id -__v -updatedAt -createdAt');
  if (update && finUpdatedUser) {
    return res.send({ status: true, message: "user updated successfully", updatedData: finUpdatedUser })
  }

}

export const getLoggedInUser = async (req, res) => {
  const userId = req.id;

  if (!userId) {
    return res.send({ status: false, message: "Please send login credentials or token" });
  }

  const findUser = await userModel.findOne({ _id: userId });

  if (!findUser) {
    return res.send({ status: false, message: "User not found" });
  }

  return res.send({ status: true, result: findUser });

}

export const mutualMatching = async (req, res) => {
  const userId = req.id;

  // const currentUser = await userModel.findById(userId);
  // const {
  //   ageFrom,
  //   ageTo,
  //   heightFrom,
  //   heightTo,
  //   expectedEducation
  // } = currentUser 
}
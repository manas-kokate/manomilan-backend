import userModel from "../models/user.model.js";
import sendMail from "../utils/mail.js";
import jwt from "jsonwebtoken";
import envCredentials from "../config/env.js";
import franchiseModel from "../models/franchise.model.js";



export const registerUser = async (req, res) => {
  try {
    const {
      // Login credentials
      loginEmail,
      loginNumber,
      password,
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
      nativeVillage,
      nativeCity,

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

    let profilePic;
    let userPhotoOne;
    let userPhotoTwo;
    let userPhotoThree;
    let userPhotoFour;

    // Handle profile pic
    try {
      if (req.files?.profilePic || req.files?.profilePic?.length !== 0) {
        profilePic = req.files.profilePic[0].filename;
      }
    } catch (error) {
      profilePic = ""
    }
    try {
      if (req.files?.userPhotoOne || req.files?.userPhotoOne?.length !== 0) {
        userPhotoOne = req.files.userPhotoOne[0].filename;
      }
    } catch (error) {
      userPhotoOne = ""
    }
    try {
      if (req.files?.userPhotoTwo || req.files?.userPhotoTwo?.length !== 0) {
        userPhotoTwo = req.files.userPhotoTwo[0].filename;
      }
    } catch (error) {
      userPhotoTwo = ""
    }
    try {
      if (req.files?.userPhotoThree || req.files?.userPhotoThree?.length !== 0) {
        userPhotoThree = req.files.userPhotoThree[0].filename;
      }
    } catch (error) {
      userPhotoThree = ""
    }
    try {
      if (req.files?.userPhotoFour || req.files?.userPhotoFour?.length !== 0) {
        userPhotoFour = req.files.userPhotoFour[0].filename;
      }
    } catch (error) {
      userPhotoFour = ""
    }

    const LastIdUser = await userModel.findOne().sort({ UserId: -1 });
    const UserId = LastIdUser ? Number(LastIdUser.UserId) + 1 : 1;

    // Create user document
    try {
      const user = new userModel({
        // Login credentials
        UserId,
        loginEmail,
        loginNumber,
        password,
        CreatedBy: "user",
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
        nativeVillage,
        nativeCity,

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

        //Photos
        profilePic,
        userPhotoOne,
        userPhotoTwo,
        userPhotoThree,
        userPhotoFour
      });

      await user.save();

      return res.send({
        status: true,
        message: "User registered successfully.",
      });
    } catch (error) {
      return res.send({ status: false, message: "Something went wrong. Send data properly." })
    }

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
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.send({
      status: false,
      message: "Invalid Credentials. All Fields Required.",
    });
  }

  try {
    const findUser = await userModel.findOne({
      $or: [{ loginEmail: identifier }, { loginNumber: identifier }]
    });
    if (!findUser) {
      return res.send({ status: false, message: "Invalid email or phone number" })
    }

    if (Number(password) != findUser.password) {
      return res.send({ status: false, message: "Wrong Password" });
    }

    const token = jwt.sign(
      { id: findUser._id },
      envCredentials.secretKey,
      { expiresIn: "4h" }
    );

    res.send({
      status: true,
      message: "User Logged in successfully",
      token: token,
      User: findUser
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
  try {
    const userId = req.id;

    // Get the logged-in user's profile
    const user = await userModel.findOne({ UserId: userId, ActiveStatus: true });
    if (!user) return res.status(404).json({ status: false, message: "User not found or inactive" });

    // Extract profile and expectations
    const {
      gender,
      height,
      ageFrom,
      ageTo,
      heightFrom,
      heightTo,
      expectedEducation,
      expectedOccupation,
      expectedIncome,
      workAbroad,
      divyangPrefer,
      expectedMaritalStatus,
      expectedNationality,
      childAccepted,
      religion,
      nativeLocation,
      workingLocation
    } = user;

    // Convert height to a comparable number if needed (optional - based on how height is stored)
    const userAge = new Date().getFullYear() - new Date(user.dob).getFullYear();

    // Reverse Gender
    const oppositeGender = gender === "male" ? "female" : "male";

    // Find users where:
    // 1. They match the current user's expectations
    // 2. AND their expectations are matched by the current user's profile

    const matchedUsers = await User.find({
      ActiveStatus: true,
      gender: oppositeGender,

      // Match to current user's expectations
      dob: {
        $gte: new Date(`${new Date().getFullYear() - parseInt(ageTo)}-01-01`),
        $lte: new Date(`${new Date().getFullYear() - parseInt(ageFrom)}-12-31`)
      },
      height: { $gte: heightFrom, $lte: heightTo },
      education: { $in: expectedEducation },
      occupation: expectedOccupation,
      monthlyIncome: expectedIncome,
      nationality: { $in: expectedNationality },
      maritalStatus: expectedMaritalStatus,
      divyang: divyangPrefer,
      nativeCity: { $in: nativeLocation },
      workLocation: { $in: workingLocation },

      // Their expectations should match logged-in user's profile
      ageFrom: { $lte: userAge },
      ageTo: { $gte: userAge },
      heightFrom: { $lte: height },
      heightTo: { $gte: height },
      expectedEducation: { $in: user.education },
      expectedOccupation: user.occupation,
      expectedIncome: user.monthlyIncome,
      expectedNationality: { $in: user.nationality },
      expectedMaritalStatus: user.maritalStatus,
      divyangPrefer: user.divyang,
      religion: { $in: user.religion || [] },
      nativeLocation: { $in: [user.nativeCity, user.nativeVillage].filter(Boolean) },
      workingLocation: { $in: [user.workLocation].filter(Boolean) },
    });

    return res.json({ status: true, count: matchedUsers.length, result: matchedUsers });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: "Internal server error" });
  }
};

export const getFranchises = async (req, res) => {
  try {
    const allFranchise = await franchiseModel.find({}, '-password');
    if (!allFranchise) {
      return res.send({ status: false, message: "No franchises found" });
    }

    return res.send({ status: true, franchises: allFranchise });
  }
  catch (err) {
    return res.send({ status: false, message: "Server error." })
  }
}

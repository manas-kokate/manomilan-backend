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
    const userId = req.id; // or get from req.body if applicable

    const currentUser = await userModel.findById(userId);
    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const currentUserAge = currentUser.dob
      ? Math.floor((Date.now() - new Date(currentUser.dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
      : null;

    const matchQuery = {
      _id: { $ne: userId },
      ActiveStatus: true,
      gender: currentUser.gender === 'male' ? 'female' : 'male'
    };

    // Age range (based on DOB)
    if (currentUser.ageFrom || currentUser.ageTo) {
      const ageFilter = {};
      if (currentUser.ageFrom) {
        const maxDob = new Date();
        maxDob.setFullYear(maxDob.getFullYear() - parseInt(currentUser.ageFrom));
        ageFilter.$lte = maxDob;
      }
      if (currentUser.ageTo) {
        const minDob = new Date();
        minDob.setFullYear(minDob.getFullYear() - parseInt(currentUser.ageTo));
        ageFilter.$gte = minDob;
      }
      if (Object.keys(ageFilter).length > 0) {
        matchQuery.dob = ageFilter;
      }
    }

    // Height
    if (currentUser.heightFrom || currentUser.heightTo) {
      const heightFilter = {};
      if (currentUser.heightFrom) heightFilter.$gte = currentUser.heightFrom;
      if (currentUser.heightTo) heightFilter.$lte = currentUser.heightTo;
      matchQuery.height = heightFilter;
    }

    if (currentUser.expectedEducation?.length) {
      matchQuery.education = { $in: currentUser.expectedEducation };
    }

    if (currentUser.expectedOccupation) {
      matchQuery.occupation = new RegExp(currentUser.expectedOccupation, 'i');
    }

    if (currentUser.expectedMaritalStatus) {
      matchQuery.maritalStatus = currentUser.expectedMaritalStatus;
    }

    if (currentUser.expectedNationality?.length) {
      matchQuery.nationality = { $in: currentUser.expectedNationality };
    }

    if (currentUser.religion?.length) {
      matchQuery.religion = { $in: currentUser.religion };
    }

    if (currentUser.nativeLocation?.length) {
      matchQuery.nativeLocation = { $in: currentUser.nativeLocation };
    }

    if (currentUser.workingLocation?.length) {
      matchQuery.workLocation = { $in: currentUser.workingLocation };
    }

    // Divyang preference
    if (currentUser.divyangPrefer && currentUser.divyangPrefer !== 'any') {
      matchQuery.divyang = currentUser.divyangPrefer === 'yes'
        ? { $exists: true, $ne: null, $ne: '' }
        : { $in: [null, ''] };
    }

    // Child acceptance
    if (currentUser.childAccepted === 'no') {
      matchQuery.children = { $exists: true, $size: 0 };
    }

    const potentialMatches = await userModel.find(matchQuery);

    const mutualMatches = [];

    for (const match of potentialMatches) {
      let isMatch = true;

      // Reverse check: does match's expectation fit currentUser?

      if (match.ageFrom && currentUserAge < parseInt(match.ageFrom)) isMatch = false;
      if (match.ageTo && currentUserAge > parseInt(match.ageTo)) isMatch = false;

      if (match.heightFrom && currentUser.height < match.heightFrom) isMatch = false;
      if (match.heightTo && currentUser.height > match.heightTo) isMatch = false;

      if (match.expectedEducation?.length &&
        (!currentUser.education || !currentUser.education.some(edu => match.expectedEducation.includes(edu)))) {
        isMatch = false;
      }

      if (match.expectedOccupation &&
        (!currentUser.occupation?.toLowerCase().includes(match.expectedOccupation.toLowerCase()))) {
        isMatch = false;
      }

      if (match.expectedMaritalStatus && currentUser.maritalStatus !== match.expectedMaritalStatus) {
        isMatch = false;
      }

      if (match.expectedNationality?.length &&
        (!currentUser.nationality || !currentUser.nationality.some(n => match.expectedNationality.includes(n)))) {
        isMatch = false;
      }

      if (match.religion?.length &&
        (!currentUser.religion || !currentUser.religion.some(r => match.religion.includes(r)))) {
        isMatch = false;
      }

      if (match.nativeLocation?.length &&
        (!currentUser.nativeLocation || !currentUser.nativeLocation.some(loc => match.nativeLocation.includes(loc)))) {
        isMatch = false;
      }

      if (match.workingLocation?.length &&
        (!currentUser.workLocation || !match.workingLocation.includes(currentUser.workLocation))) {
        isMatch = false;
      }

      if (match.divyangPrefer === 'yes' && !currentUser.divyang) isMatch = false;
      if (match.divyangPrefer === 'no' && currentUser.divyang) isMatch = false;

      if (match.childAccepted === 'no' && currentUser.children?.length > 0) isMatch = false;

      if (isMatch) {
        const {
          _id, firstName, lastName, gender, dob, height, occupation,
          education, maritalStatus, nationality, caste, motherTongue,
          profilePic, userPhotoOne, userPhotoTwo, userPhotoThree, userPhotoFour,
          workLocation, monthlyIncome, religion, sect, manglik,
          foodPreference, bloodGroup, premium
        } = match;

        mutualMatches.push({
          _id, firstName, lastName, gender, dob, height, occupation,
          education, maritalStatus, nationality, caste, motherTongue,
          profilePic, userPhotoOne, userPhotoTwo, userPhotoThree, userPhotoFour,
          workLocation, monthlyIncome, religion, sect, manglik,
          foodPreference, bloodGroup, premium
        });
      }
    }

    res.status(200).json({
      success: true,
      message: `Found ${mutualMatches.length} mutual matches`,
      totalMatches: mutualMatches.length,
      matches: mutualMatches
    });

  } catch (error) {
    console.error("Error in mutual matching:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
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

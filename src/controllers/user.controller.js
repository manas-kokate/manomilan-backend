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
    const userId = req.id; // or req.body depending on your API design

    // Get the current user's profile
    const currentUser = await userModel.findById(userId);

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Build query to find potential matches
    const matchQuery = {
      _id: { $ne: userId }, // Exclude current user
      ActiveStatus: true, // Only active users
    };

    // Gender filter - opposite gender
    if (currentUser.gender) {
      matchQuery.gender = currentUser.gender === 'male' ? 'female' : 'male';
    }

    // Age range filter
    if (currentUser.ageFrom || currentUser.ageTo) {
      const currentUserAge = currentUser.dob ?
        Math.floor((new Date() - new Date(currentUser.dob)) / (365.25 * 24 * 60 * 60 * 1000)) : null;

      if (currentUserAge) {
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
    }

    // Height filter
    if (currentUser.heightFrom || currentUser.heightTo) {
      const heightFilter = {};
      if (currentUser.heightFrom) {
        heightFilter.$gte = currentUser.heightFrom;
      }
      if (currentUser.heightTo) {
        heightFilter.$lte = currentUser.heightTo;
      }
      if (Object.keys(heightFilter).length > 0) {
        matchQuery.height = heightFilter;
      }
    }

    // Education filter
    if (currentUser.expectedEducation && currentUser.expectedEducation.length > 0) {
      matchQuery.education = { $in: currentUser.expectedEducation };
    }

    // Occupation filter
    if (currentUser.expectedOccupation) {
      matchQuery.occupation = new RegExp(currentUser.expectedOccupation, 'i');
    }

    // Marital status filter
    if (currentUser.expectedMaritalStatus) {
      matchQuery.maritalStatus = currentUser.expectedMaritalStatus;
    }

    // Nationality filter
    if (currentUser.expectedNationality && currentUser.expectedNationality.length > 0) {
      matchQuery.nationality = { $in: currentUser.expectedNationality };
    }

    // Religion filter
    if (currentUser.religion && currentUser.religion.length > 0) {
      matchQuery.religion = { $in: currentUser.religion };
    }

    // Native location filter
    if (currentUser.nativeLocation && currentUser.nativeLocation.length > 0) {
      matchQuery.nativeLocation = { $in: currentUser.nativeLocation };
    }

    // Working location filter
    if (currentUser.workingLocation && currentUser.workingLocation.length > 0) {
      matchQuery.workLocation = { $in: currentUser.workingLocation };
    }

    // Divyang preference
    if (currentUser.divyangPrefer && currentUser.divyangPrefer !== 'any') {
      if (currentUser.divyangPrefer === 'yes') {
        matchQuery.divyang = { $exists: true, $ne: null, $ne: '' };
      } else if (currentUser.divyangPrefer === 'no') {
        matchQuery.$or = [
          { divyang: { $exists: false } },
          { divyang: null },
          { divyang: '' }
        ];
      }
    }

    // Child acceptance
    if (currentUser.childAccepted && currentUser.childAccepted !== 'any') {
      if (currentUser.childAccepted === 'no') {
        matchQuery.$or = [
          { children: { $exists: false } },
          { children: { $size: 0 } }
        ];
      }
    }

    // Get potential matches
    const potentialMatches = await userModel.find(matchQuery);

    // Filter for mutual matching
    const mutualMatches = [];
    const currentUserAge = currentUser.dob ?
      Math.floor((new Date() - new Date(currentUser.dob)) / (365.25 * 24 * 60 * 60 * 1000)) : null;

    for (const match of potentialMatches) {
      let isMatch = true;

      // Check if current user matches the potential match's expectations

      // Age check
      if (match.ageFrom || match.ageTo) {
        if (currentUserAge) {
          if (match.ageFrom && currentUserAge < parseInt(match.ageFrom)) {
            isMatch = false;
          }
          if (match.ageTo && currentUserAge > parseInt(match.ageTo)) {
            isMatch = false;
          }
        }
      }

      // Height check
      if (match.heightFrom || match.heightTo) {
        if (currentUser.height) {
          if (match.heightFrom && currentUser.height < match.heightFrom) {
            isMatch = false;
          }
          if (match.heightTo && currentUser.height > match.heightTo) {
            isMatch = false;
          }
        }
      }

      // Education check
      if (match.expectedEducation && match.expectedEducation.length > 0) {
        if (!currentUser.education || !currentUser.education.some(edu =>
          match.expectedEducation.includes(edu))) {
          isMatch = false;
        }
      }

      // Occupation check
      if (match.expectedOccupation) {
        if (!currentUser.occupation ||
          !currentUser.occupation.toLowerCase().includes(match.expectedOccupation.toLowerCase())) {
          isMatch = false;
        }
      }

      // Marital status check
      if (match.expectedMaritalStatus) {
        if (currentUser.maritalStatus !== match.expectedMaritalStatus) {
          isMatch = false;
        }
      }

      // Nationality check
      if (match.expectedNationality && match.expectedNationality.length > 0) {
        if (!currentUser.nationality || !currentUser.nationality.some(nat =>
          match.expectedNationality.includes(nat))) {
          isMatch = false;
        }
      }

      // Religion check
      if (match.religion && match.religion.length > 0) {
        if (!currentUser.religion || !currentUser.religion.some(rel =>
          match.religion.includes(rel))) {
          isMatch = false;
        }
      }

      // Native location check
      if (match.nativeLocation && match.nativeLocation.length > 0) {
        if (!currentUser.nativeLocation || !currentUser.nativeLocation.some(loc =>
          match.nativeLocation.includes(loc))) {
          isMatch = false;
        }
      }

      // Working location check
      if (match.workingLocation && match.workingLocation.length > 0) {
        if (!currentUser.workLocation || !match.workingLocation.includes(currentUser.workLocation)) {
          isMatch = false;
        }
      }

      // Divyang preference check
      if (match.divyangPrefer && match.divyangPrefer !== 'any') {
        if (match.divyangPrefer === 'yes') {
          if (!currentUser.divyang) {
            isMatch = false;
          }
        } else if (match.divyangPrefer === 'no') {
          if (currentUser.divyang) {
            isMatch = false;
          }
        }
      }

      // Child acceptance check
      if (match.childAccepted && match.childAccepted !== 'any') {
        if (match.childAccepted === 'no') {
          if (currentUser.children && currentUser.children.length > 0) {
            isMatch = false;
          }
        }
      }

      if (isMatch) {
        // Remove sensitive information before sending
        const sanitizedMatch = {
          _id: match._id,
          firstName: match.firstName,
          lastName: match.lastName,
          gender: match.gender,
          dob: match.dob,
          height: match.height,
          occupation: match.occupation,
          education: match.education,
          maritalStatus: match.maritalStatus,
          nationality: match.nationality,
          caste: match.caste,
          motherTongue: match.motherTongue,
          profilePic: match.profilePic,
          userPhotoOne: match.userPhotoOne,
          userPhotoTwo: match.userPhotoTwo,
          userPhotoThree: match.userPhotoThree,
          userPhotoFour: match.userPhotoFour,
          workLocation: match.workLocation,
          monthlyIncome: match.monthlyIncome,
          religion: match.religion,
          sect: match.sect,
          manglik: match.manglik,
          foodPreference: match.foodPreference,
          bloodGroup: match.bloodGroup,
          premium: match.premium
        };
        mutualMatches.push(sanitizedMatch);
      }
    }

    res.status(200).json({
      success: true,
      message: `Found ${mutualMatches.length} mutual matches`,
      totalMatches: mutualMatches.length,
      matches: mutualMatches
    });

  } catch (error) {
    console.error('Error in mutual matching:', error);
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

import userModel from "../models/user.model.js";
import sendMail from "../utils/mail.js";
import jwt from "jsonwebtoken";
import envCredentials from "../config/env.js";
import franchiseModel from "../models/franchise.model.js";
import MessageModel from "../models/small_models/message.model.js";
import adminModel from "../models/admin.model.js";
import distributorModel from "../models/distributor.model.js";
import freepackageModel from "../models/small_models/freepackage.model.js";
import userPackageTrackModel from "../models/small_models/userPackageTrack.model.js";


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
      caste, // should be an object { religion, caste, subCaste }
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
      nativeCity, // should be an object { country, state, city }

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
      expectedMonthlyIncome,
      expectedWorkAbroad,
      divyangPrefer,
      expectedMaritalStatus,
      expectedNationality,
      childAccepted,
      expectedReligion, // array of { religion, caste, subCaste }
      expectedNativeLocation, // array of { country, state, city }
      expectedWorkingLocation, // array of { country, state, city }

      // Special Info
      sect,
      manglik,
      gotra,
      foodPreference,
      specs,
      bloodGroup,
    } = req.body;

    if (!loginEmail || !loginNumber || !password || !franchiseUnder) {
      return res.status(400).send({ status: false, message: "Login credentials required to register" });
    }

    // Check for existing user
    const existingUser = await userModel.findOne({
      $or: [{ loginEmail }, { loginNumber }],
    });

    if (existingUser) {
      return res.status(400).send({
        status: false,
        message: "User already exists with this email or number.",
      });
    }

    // File Handling
    let profilePic = req?.files?.profilePic?.[0]?.filename || "";
    let userPhotoOne = req?.files?.userPhotoOne?.[0]?.filename || "";
    let userPhotoTwo = req?.files?.userPhotoTwo?.[0]?.filename || "";
    let userPhotoThree = req?.files?.userPhotoThree?.[0]?.filename || "";
    let userPhotoFour = req?.files?.userPhotoFour?.[0]?.filename || "";

    // Generate new UserId
    const LastIdUser = await userModel.findOne().sort({ UserId: -1 });
    const UserId = LastIdUser ? Number(LastIdUser.UserId) + 1 : 1;


    // Prepare user object
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
      children: typeof children === 'string' ? JSON.parse(children) : children,
      height,
      occupation,
      monthlyIncome,
      nationality: nationality || ["India"],
      caste, // assumed to be { religion, caste, subCaste }
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
      nativeCity, // { country, state, city }
      workAbroad: req.body.workAbroad || "No",

      // Education & Career
      education,
      companyName,
      designation,
      candidateNumber,
      candidateEmail,
      workLocation,
      isWorking: isWorking !== undefined ? isWorking : true,

      // Expectations
      ageFrom,
      ageTo,
      heightFrom,
      heightTo,
      expectedEducation,
      expectedOccupation,
      expectedMonthlyIncome,
      expectedWorkAbroad,
      divyangPrefer,
      expectedMaritalStatus,
      expectedNationality,
      childAccepted,

      expectedReligion: typeof expectedReligion === 'string' ? JSON.parse(expectedReligion) : expectedReligion,

      expectedNativeLocation: typeof expectedNativeLocation === "string" ? JSON.parse(expectedNativeLocation) : expectedNativeLocation,

      expectedWorkingLocation: typeof expectedWorkingLocation === "string" ? JSON.parse(expectedWorkingLocation) : expectedWorkingLocation,

      // Photos
      profilePic,
      userPhotoOne,
      userPhotoTwo,
      userPhotoThree,
      userPhotoFour,

      // Special Info
      sect,
      manglik,
      gotra,
      foodPreference,
      specs,
      bloodGroup,
    });

    const SavedNewUser = await user.save();

    const freePackage = await freepackageModel.findOne({ status: 'Active' })

    const newPackageLog = new userPackageTrackModel({
      userId: SavedNewUser._id,
      freeAddresses: freePackage.NumOfFreeAddress,
      freePackage: freePackage._id
    })
    await newPackageLog.save()
    return res.status(200).send({
      status: true,
      message: "User registered successfully.",
      user: SavedNewUser,
      packageLog: newPackageLog
    });
  } catch (error) {
    console.error("Registration Error:", error);
    return res.status(500).send({
      status: false,
      message: "Server Error",
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

export const getCurrentUserWithoutAuth = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await userModel.findById(userId);
    if (!user) {
      return res.send({ status: false, message: "User not found" })
    }
    return res.send({ status: true, user })
  } catch (error) {
    return res.send({ status: false, message: "Server error" })
  }


}

export const mutualMatching = async (req, res) => {
  try {
    const userId = req.id;
    const currentUser = await userModel.findById(userId).lean();
    if (!currentUser) {
      console.log('User not found:', userId);
      return res.status(404).send({ status: false, message: "User not found" });
    }

    // Build one-way filter
    const filterConditions = [
      { _id: { $ne: userId } },
      { ActiveStatus: true },
      { gender: { $ne: currentUser.gender?.toLowerCase() || '' } }
    ];

    const orConditions = [];

    // Age filter
    if (currentUser.ageFrom && currentUser.ageTo) {
      const ageFrom = parseInt(currentUser.ageFrom);
      const ageTo = parseInt(currentUser.ageTo);
      if (!isNaN(ageFrom) && !isNaN(ageTo) && ageFrom >= 18 && ageTo <= 100) {
        const currentYear = new Date().getFullYear();
        const birthYearFrom = currentYear - ageTo;
        const birthYearTo = currentYear - ageFrom;
        filterConditions.push({
          dob: {
            $gte: new Date(`${birthYearFrom}-01-01`),
            $lte: new Date(`${birthYearTo}-12-31`)
          }
        });
      } else {
        console.log('Skipping invalid age range:', { ageFrom, ageTo });
      }
    }

    // Education filter (mandatory)
    if (Array.isArray(currentUser.expectedEducation) && !currentUser.expectedEducation.includes('ANY')) {
      filterConditions.push({ education: { $in: currentUser.expectedEducation } });
    }

    // Height filter
    if (currentUser.heightFrom && currentUser.heightTo && currentUser.heightFrom !== 'ANY' && currentUser.heightTo !== 'ANY') {
      const heightFrom = parseInt(currentUser.heightFrom);
      const heightTo = parseInt(currentUser.heightTo);
      if (!isNaN(heightFrom) && !isNaN(heightTo)) {
        orConditions.push({ height: { $gte: heightFrom, $lte: heightTo } });
      }
    }

    // Occupation filter
    if (currentUser.expectedOccupation && currentUser.expectedOccupation !== 'ANY') {
      orConditions.push({ occupation: { $regex: new RegExp(currentUser.expectedOccupation, 'i') } });
    }

    // Monthly income filter
    if (currentUser.expectedMonthlyIncome && currentUser.expectedMonthlyIncome !== 'ANY') {
      const income = parseInt(currentUser.expectedMonthlyIncome);
      if (!isNaN(income)) {
        orConditions.push({ monthlyIncome: { $gte: income } });
      }
    }

    // Work abroad filter
    if (currentUser.expectedWorkAbroad && currentUser.expectedWorkAbroad.toLowerCase() !== 'any') {
      orConditions.push({ workAbroad: { $regex: new RegExp(currentUser.expectedWorkAbroad, 'i') } });
    }

    // Marital status filter
    if (currentUser.expectedMaritalStatus && currentUser.expectedMaritalStatus !== 'ANY') {
      orConditions.push({ maritalStatus: { $regex: new RegExp(currentUser.expectedMaritalStatus, 'i') } });
    }

    // Nationality filter
    if (Array.isArray(currentUser.expectedNationality) && !currentUser.expectedNationality.includes('ANY')) {
      orConditions.push({ nationality: { $in: currentUser.expectedNationality } });
    }

    // Religion filter
    if (Array.isArray(currentUser.expectedReligion) && !currentUser.expectedReligion.includes('ANY')) {
      const casteValues = currentUser.expectedReligion.map(r => r.caste).filter(Boolean);
      if (casteValues.length) {
        orConditions.push(
          { 'caste.caste': { $in: casteValues } },
          { caste: { $in: casteValues } }
        );
      }
    }

    // Children filter
    if (currentUser.childAccepted && currentUser.childAccepted.toLowerCase() === 'yes') {
      orConditions.push({ children: { $exists: true } });
    } else {
      orConditions.push({ children: { $exists: true, $size: 0 } });
    }

    // Location filter
    const extractLocations = (arr, field, isObject = false) => {
      return arr.flatMap(loc => {
        const conditions = [];
        if (loc.country && loc.country !== 'ANY') {
          conditions.push(isObject ? { [`${field}.country`]: loc.country } : { [field]: { $regex: loc.country, $options: 'i' } });
        }
        if (loc.state && loc.state !== 'ANY') {
          conditions.push(isObject ? { [`${field}.state`]: loc.state } : { [field]: { $regex: loc.state, $options: 'i' } });
        }
        if (loc.city && loc.city !== 'ANY') {
          conditions.push(isObject ? { [`${field}.city`]: loc.city } : { [field]: { $regex: loc.city, $options: 'i' } });
        }
        return conditions;
      });
    };

    if (Array.isArray(currentUser.expectedNativeLocation)) {
      orConditions.push(...extractLocations(currentUser.expectedNativeLocation, 'nativeCity', true));
    }
    if (Array.isArray(currentUser.expectedWorkingLocation)) {
      orConditions.push(...extractLocations(currentUser.expectedWorkingLocation, 'workLocation', false));
    }

    const finalQuery = orConditions.length ? { $and: filterConditions, $or: orConditions } : { $and: filterConditions };

    // console.log('One-way filter:', JSON.stringify(finalQuery, null, 2));
    const oneWayMatches = await userModel.find(finalQuery).lean().sort({ createdAt: -1 });
    // console.log('One-way matches:', oneWayMatches.map(u => ({ _id: u._id.toString(), firstName: u.firstName, expectedWorkAbroad: u.expectedWorkAbroad, education: u.education })));

    // Mutual matching
    const mutualMatches = [];
    for (const match of oneWayMatches) {
      // console.log(`Processing mutual match for user: ${match._id}, firstName: ${match.firstName}`);
      const reverseConditions = [
        { _id: userId },
        { ActiveStatus: true },
        { gender: { $ne: match.gender?.toLowerCase() || '' } }
      ];

      const reverseOrConditions = [];

      // Age filter
      if (match.ageFrom && match.ageTo) {
        const ageFrom = parseInt(match.ageFrom);
        const ageTo = parseInt(match.ageTo);
        if (!isNaN(ageFrom) && !isNaN(ageTo) && ageFrom >= 18 && ageTo <= 100) {
          const currentYear = new Date().getFullYear();
          const birthYearFrom = currentYear - ageTo;
          const birthYearTo = currentYear - ageFrom;
          reverseConditions.push({
            dob: {
              $gte: new Date(`${birthYearFrom}-01-01`),
              $lte: new Date(`${birthYearTo}-12-31`)
            }
          });
        }
      }

      // Education filter (mandatory)
      if (Array.isArray(match.expectedEducation) && !match.expectedEducation.includes('ANY')) {
        reverseConditions.push({ education: { $in: match.expectedEducation } });
      }

      // Height filter
      if (match.heightFrom && match.heightTo && match.heightFrom !== 'ANY' && match.heightTo !== 'ANY') {
        const heightFrom = parseInt(match.heightFrom);
        const heightTo = parseInt(match.heightTo);
        if (!isNaN(heightFrom) && !isNaN(heightTo)) {
          reverseOrConditions.push({ height: { $gte: heightFrom, $lte: heightTo } });
        }
      }

      // Occupation filter
      if (match.expectedOccupation && match.expectedOccupation !== 'ANY') {
        reverseOrConditions.push({ occupation: { $regex: new RegExp(match.expectedOccupation, 'i') } });
      }

      // Monthly income filter
      if (match.expectedMonthlyIncome && match.expectedMonthlyIncome !== 'ANY') {
        const income = parseInt(match.expectedMonthlyIncome);
        if (!isNaN(income)) {
          reverseOrConditions.push({ monthlyIncome: { $gte: income } });
        }
      }

      // Work abroad filter
      if (match.expectedWorkAbroad && match.expectedWorkAbroad.toLowerCase() !== 'any') {
        reverseOrConditions.push({ workAbroad: { $regex: new RegExp(match.expectedWorkAbroad, 'i') } });
      }

      // Marital status filter
      if (match.expectedMaritalStatus && match.expectedMaritalStatus !== 'ANY') {
        reverseOrConditions.push({ maritalStatus: { $regex: new RegExp(match.expectedMaritalStatus, 'i') } });
      }

      // Nationality filter
      if (Array.isArray(match.expectedNationality) && !match.expectedNationality.includes('ANY')) {
        reverseOrConditions.push({ nationality: { $in: match.expectedNationality } });
      }

      // Religion filter
      if (Array.isArray(match.expectedReligion) && !match.expectedReligion.includes('ANY')) {
        const casteValues = match.expectedReligion.map(r => r.caste).filter(Boolean);
        if (casteValues.length) {
          reverseOrConditions.push(
            { 'caste.caste': { $in: casteValues } },
            { caste: { $in: casteValues } }
          );
        }
      }

      // Children filter
      if (match.childAccepted && match.childAccepted.toLowerCase() === 'yes') {
        reverseOrConditions.push({ children: { $exists: true } });
      } else {
        reverseOrConditions.push({ children: { $exists: true, $size: 0 } });
      }

      // Location filter
      if (Array.isArray(match.expectedNativeLocation)) {
        reverseOrConditions.push(...extractLocations(match.expectedNativeLocation, 'nativeCity', true));
      }
      if (Array.isArray(match.expectedWorkingLocation)) {
        reverseOrConditions.push(...extractLocations(match.expectedWorkingLocation, 'workLocation', false));
      }

      const reverseQuery = reverseOrConditions.length ? { $and: reverseConditions, $or: reverseOrConditions } : { $and: reverseConditions };

      // console.log(`Mutual filter for ${match._id}:`, JSON.stringify(reverseQuery, null, 2));
      const mutual = await userModel.findOne(reverseQuery).lean();
      if (mutual) {
        mutualMatches.push(match);
      }
    }

    // console.log('Mutual matches:', mutualMatches.map(u => ({ _id: u._id.toString(), firstName: u.firstName, education: u.education })));
    return res.status(200).send({ status: true, Matches: mutualMatches });
  } catch (err) {
    // console.error('Error in matching:', err);
    return res.status(500).send({ status: false, message: 'Server error', error: err.message });
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

export const getCurrentUser = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.send({ status: false, message: "User id required" })
    }
    const user = await userModel.findById(userId);
    if (!user) {
      return res.send({ status: false, message: "User not found." })
    }
    return res.send({ status: true, user })
  } catch (error) {
    return res.send({ status: false, message: "Server error" })
  }
}

export const editExpectaions = async (req, res) => {
  try {
    const { expectations } = req.body;
    const userId = req.id;

    if (!expectations) {
      return res.status(400).send({ status: false, message: 'No valid data found to update' });
    }

    const existingUser = await userModel.findById(userId);
    if (!existingUser) {
      return res.status(404).send({ status: false, message: 'User not found' });
    }

    // Prepare update data, merging with existing values to preserve unedited fields
    const updateData = {
      ageFrom: expectations.ageFrom !== undefined ? expectations.ageFrom : existingUser.ageFrom,
      ageTo: expectations.ageTo !== undefined ? expectations.ageTo : existingUser.ageTo,
      heightFrom: expectations.heightFrom !== undefined ? expectations.heightFrom : existingUser.heightFrom,
      heightTo: expectations.heightTo !== undefined ? expectations.heightTo : existingUser.heightTo,
      expectedOccupation: expectations.expectedOccupation !== undefined
        ? expectations.expectedOccupation
        : existingUser.expectedOccupation,
      expectedIncome: expectations.expectedIncome !== undefined
        ? expectations.expectedIncome
        : existingUser.expectedIncome,
      workAbroad: expectations.workAbroad !== undefined ? expectations.workAbroad : existingUser.workAbroad,
      divyangPrefer: expectations.divyangPrefer !== undefined
        ? expectations.divyangPrefer
        : existingUser.divyangPrefer,
      expectedNationality: expectations.expectedNationality !== undefined
        ? expectations.expectedNationality
        : existingUser.expectedNationality,
      expectedMaritalStatus: expectations.expectedMaritalStatus !== undefined
        ? expectations.expectedMaritalStatus
        : existingUser.expectedMaritalStatus,
      childAccepted: expectations.childAccepted !== undefined
        ? expectations.childAccepted
        : existingUser.childAccepted,
      expectedEducation: expectations.expectedEducation !== undefined
        ? expectations.expectedEducation
        : existingUser.expectedEducation,
      expectedReligion: expectations.expectedReligion !== undefined
        ? expectations.expectedReligion
        : existingUser.expectedReligion,
      expectedNativeLocation: expectations.expectedNativeLocation !== undefined
        ? expectations.expectedNativeLocation
        : existingUser.expectedNativeLocation,
      expectedWorkingLocation: expectations.expectedWorkingLocation !== undefined
        ? expectations.expectedWorkingLocation
        : existingUser.expectedWorkingLocation,
    };

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(500).send({ status: false, message: 'Failed to update user' });
    }

    const finalUser = await userModel.findById(userId, '-password -__v -updatedAt -createdAt');
    return res.status(200).send({
      status: true,
      message: 'User updated successfully',
      updatedData: finalUser,
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return res.status(500).send({
      status: false,
      message: "Server error",
    });
  }
}

// === MESSAGES ===
export const getFrachiseAndDistributorAndAdmin = async (req, res) => {
  try {
    const franchiseUnder = req.params.franchiseUnder;
    const franchise = await franchiseModel.findOne({ franchiseName: franchiseUnder })
    const distributor = await distributorModel.findOne({ distributorName: franchise.distributorUnder })
    const admin = await adminModel.find({}, '-points -transactionPassword -givePointsPassword -password -_id -__v -createdAt -updatedAt')
    return res.send({ status: true, franchise, distributor, admin })
  } catch (error) {
    return res.send({ status: false, message: "Server error" })
  }
}

export const sendMessageFromUser = async (req, res) => {
  const getUserNameById = async (id) => {
    let user = await adminModel.findById(id) || await distributorModel.findById(id) || await franchiseModel.findById(id) || await userModel.findById(id);
    if (user) {
      return user.firstName ? `${user.firstName} ${user.midname} ${user.lastName}` : user.franchiseName ? user.franchiseName : user.distributorName ? user.distributorName : user.name
    } else {
      return 'Unknown'
    }
  };

  try {
    const senderId = req.id;
    const { receiverIds, message } = req.body;

    if (!message) {
      return res.send({ status: false, message: "message not found" })
    }

    if (receiverIds.length == 0) {
      return res.send({ status: false, message: "No receiver IDs found" })
    }

    const user = await userModel.findById(senderId);
    const to = await Promise.all(receiverIds.map(async id => await getUserNameById(id)));

    const NewMessage = new MessageModel({
      senderId,
      receiverId: receiverIds,
      from: `${user.firstName} ${user.midname} ${user.lastName}`,
      to,
      message,
      status: 'sent'
    })

    await NewMessage.save();
    return res.send({ status: true, message: "Message sent successfully" })
  } catch (error) {
    return res.send({ status: false, message: 'Server error' })
  }
}

export const getSentMessagesForUser = async (req, res) => {
  const senderId = req.id;

  try {
    const sentMessages = await MessageModel.find({
      senderId,
      status: 'sent'
    }).sort({ createdAt: -1 });

    return res.send({ status: true, data: sentMessages });
  } catch (error) {
    return res.send({ status: false, message: "Server error. Failed to fetch sent messages" });
  }
};

export const draftMessageFromUser = async (req, res) => {
  const getUserNameById = async (id) => {
    let user = await adminModel.findById(id) || await distributorModel.findById(id) || await franchiseModel.findById(id) || await userModel.findById(id);
    if (user) {
      return user.firstName ? `${user.firstName} ${user.midname} ${user.lastName}` : user.franchiseName || user.distributorName || user.name;
    } else {
      return 'Unknown';
    }
  };

  try {
    const senderId = req.id;
    const { receiverIds, message } = req.body;

    if (!message) {
      return res.send({ status: false, message: "Message content is missing" });
    }

    if (!receiverIds || receiverIds.length === 0) {
      return res.send({ status: false, message: "No receiver IDs provided" });
    }

    const user = await userModel.findById(senderId);
    const to = await Promise.all(receiverIds.map(id => getUserNameById(id)));

    const DraftMessage = new MessageModel({
      senderId,
      receiverId: receiverIds,
      from: `${user.firstName} ${user.midname} ${user.lastName}`,
      to,
      message,
      status: 'drafted'
    });


    await DraftMessage.save();
    return res.send({ status: true, message: "Message drafted successfully" });
  } catch (error) {
    return res.send({ status: false, message: "Failed to draft message", error });
  }
};

export const getDraftedMessagesForUser = async (req, res) => {
  const senderId = req.id;
  try {
    const draftedMessages = await MessageModel.find({
      senderId,
      status: 'drafted'
    }).sort({ updatedAt: -1 });

    return res.send({ status: true, data: draftedMessages });
  } catch (error) {
    return res.send({ status: false, message: "Server error. Failed to fetch drafted messages" });
  }
};

export const getRepliesForUser = async (req, res) => {
  const userId = req.id;

  try {
    const receivedMessages = await MessageModel.find({
      receiverId: userId,
      status: 'sent'
    }).sort({ createdAt: -1 });

    return res.send({ status: true, data: receivedMessages });
  } catch (error) {
    return res.send({ status: false, message: "Failed to fetch replies", error });
  }
};




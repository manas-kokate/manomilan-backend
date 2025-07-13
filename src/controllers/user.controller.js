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
      children,
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
      expectedReligion,
      expectedNativeLocation,
      expectedWorkingLocation,

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

    await user.save();

    return res.status(200).send({
      status: true,
      message: "User registered successfully.",
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
    const oneWayMatches = await userModel.find(finalQuery).lean();
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

// export const testmutualMatching = async (req, res) => {
//   const userId = req.id;
//   const currentUser = await userModel.findById(userId);
//   const {
//     ageFrom,
//     ageTo,
//     heightFrom,
//     heightTo,
//     expectedEducation,
//     expectedOccupation,
//     expectedMonthlyIncome,
//     expectedWorkAbroad,
//     divyangPrefer,
//     expectedMaritalStatus,
//     expectedNationality,
//     childAccepted,
//     expectedReligion,
//     expectedNativeLocation,
//     expectedWorkingLocation
//   } = currentUser;

//   // console.log(currentUser)
//   const filterObj = {}

//   filterObj._id = {
//     $ne: userId
//   }


//   filterObj.gender = {
//     $ne: currentUser.gender.toLowerCase()
//   }


//   filterObj.ActiveStatus = true;

//   if (heightFrom !== 'ANY' && heightTo !== 'ANY') {
//     filterObj.height = {
//       $gte: parseInt(heightFrom),
//       $lte: parseInt(heightTo)
//     }
//   }

//   if (!expectedEducation.includes('ANY')) {
//     filterObj.education = {
//       $in: expectedEducation
//     }
//   }

//   if (expectedOccupation !== 'ANY') {
//     filterObj.occupation = expectedOccupation
//   }

//   if (expectedMonthlyIncome !== 'ANY') {
//     filterObj.monthlyIncome = {
//       $gte: expectedMonthlyIncome
//     }
//   }

//   filterObj.workAbroad = expectedWorkAbroad.toLowerCase();

//   filterObj.divyang = divyangPrefer;

//   if (expectedMaritalStatus !== 'ANY') {
//     filterObj.maritalStatus = expectedMaritalStatus;
//   }

//   if (!expectedNationality.includes('ANY')) {
//     filterObj.nationality = {
//       $in: expectedNationality
//     }
//   }

//   if (childAccepted.toLowerCase() === 'yes') {
//     filterObj.children = { $not: { $size: 0 } }
//   } else {
//     filterObj.children = { $size: 0 }
//   }

//   if (expectedReligion?.length) {
//     const casteOrConditions = [];

//     for (const item of expectedReligion) {
//       const isAllAny =
//         item.religion === 'ANY' &&
//         item.caste === 'ANY' &&
//         item.subCaste === 'ANY';

//       if (!isAllAny) {
//         const condition = {};
//         if (item.religion !== 'ANY') {
//           condition['caste.religion'] = item.religion;
//         }
//         if (item.caste !== 'ANY') {
//           condition['caste.caste'] = item.caste;
//         }
//         if (item.subCaste !== 'ANY') {
//           condition['caste.subCaste'] = item.subCaste;
//         }
//         casteOrConditions.push(condition);
//       }
//     }

//     if (casteOrConditions.length > 0) {
//       filterObj.$or = casteOrConditions;
//     }
//   }


//   // Add native location filtering
//   if (expectedNativeLocation?.length) {
//     const nativeOrConditions = [];

//     for (const loc of expectedNativeLocation) {
//       const isAllAny =
//         loc.country === 'ANY' &&
//         loc.state === 'ANY' &&
//         loc.city === 'ANY';

//       if (!isAllAny) {
//         const condition = {};
//         if (loc.country !== 'ANY') {
//           condition['nativeCity.country'] = loc.country;
//         }
//         if (loc.state !== 'ANY') {
//           condition['nativeCity.state'] = loc.state;
//         }
//         if (loc.city !== 'ANY') {
//           condition['nativeCity.city'] = loc.city;
//         }
//         nativeOrConditions.push(condition);
//       }
//     }

//     if (nativeOrConditions.length > 0) {
//       // Merge with existing $or if needed (like from expectedReligion)
//       if (filterObj.$or) {
//         filterObj.$and = [
//           { $or: filterObj.$or },
//           { $or: nativeOrConditions }
//         ];
//         delete filterObj.$or;
//       } else {
//         filterObj.$or = nativeOrConditions;
//       }
//     }
//   }


//   console.log(filterObj)

//   const OneWayUsers = await userModel.find(filterObj);
//   return res.send({ status: true, Matches: OneWayUsers })
// };




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
      expectedMonthlyIncome,
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
        expectedMonthlyIncome,
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

    console.log('One-way filter:', JSON.stringify(finalQuery, null, 2));
    const oneWayMatches = await userModel.find(finalQuery).lean();
    console.log('One-way matches:', oneWayMatches.map(u => ({ _id: u._id.toString(), firstName: u.firstName, expectedWorkAbroad: u.expectedWorkAbroad, education: u.education })));

    // Mutual matching
    const mutualMatches = [];
    for (const match of oneWayMatches) {
      console.log(`Processing mutual match for user: ${match._id}, firstName: ${match.firstName}`);
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

      console.log(`Mutual filter for ${match._id}:`, JSON.stringify(reverseQuery, null, 2));
      const mutual = await userModel.findOne(reverseQuery).lean();
      if (mutual) {
        mutualMatches.push(match);
      }
    }

    console.log('Mutual matches:', mutualMatches.map(u => ({ _id: u._id.toString(), firstName: u.firstName, education: u.education })));
    return res.status(200).send({ status: true, Matches: mutualMatches });
  } catch (err) {
    console.error('Error in matching:', err);
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

// export const mutualTest = async (req, res) => {
//   try {
//     const userId = req.id;
//     const currentUser = await userModel.findById(userId);

//     if (!currentUser) {
//       return res.status(404).json({ status: false, message: "User not found" });
//     }

//     const {
//       ageFrom,
//       ageTo,
//       heightFrom,
//       heightTo,
//       expectedEducation,
//       expectedOccupation,
//       expectedMonthlyIncome,
//       expectedWorkAbroad,
//       divyangPrefer,
//       expectedMaritalStatus,
//       expectedNationality,
//       childAccepted,
//       expectedReligion,
//       expectedNativeLocation,
//       expectedWorkingLocation
//     } = currentUser;

//     // STEP 1: Find users who match current user's expectations (One-way matching)
//     const filterObj = {};

//     filterObj._id = {
//       $ne: userId
//     };

//     filterObj.gender = {
//       $ne: currentUser.gender.toLowerCase()
//     };

//     filterObj.ActiveStatus = true;

//     // Age filter based on user's dob
//     if (ageFrom !== 'ANY' && ageTo !== 'ANY') {
//       const currentYear = new Date().getFullYear();
//       const maxBirthYear = currentYear - parseInt(ageFrom);
//       const minBirthYear = currentYear - parseInt(ageTo);

//       filterObj.dob = {
//         $gte: new Date(`${minBirthYear}-01-01`),
//         $lte: new Date(`${maxBirthYear}-12-31`)
//       };
//     }

//     // Height filter
//     if (heightFrom !== 'ANY' && heightTo !== 'ANY') {
//       filterObj.height = {
//         $gte: parseInt(heightFrom),
//         $lte: parseInt(heightTo)
//       };
//     }

//     // Education filter
//     if (!expectedEducation.includes('ANY')) {
//       filterObj.education = {
//         $in: expectedEducation
//       };
//     }

//     // Occupation filter
//     if (expectedOccupation !== 'ANY') {
//       filterObj.occupation = expectedOccupation;
//     }

//     // Monthly income filter
//     if (expectedMonthlyIncome !== 'ANY') {
//       filterObj.monthlyIncome = {
//         $gte: expectedMonthlyIncome
//       };
//     }

//     // Work abroad filter
//     if (expectedWorkAbroad !== 'ANY') {
//       filterObj.workAbroad = expectedWorkAbroad.toLowerCase();
//     }

//     // Divyang preference filter
//     if (divyangPrefer !== 'ANY') {
//       filterObj.divyang = divyangPrefer.toLowerCase();
//     }

//     // Marital status filter
//     if (expectedMaritalStatus !== 'ANY') {
//       filterObj.maritalStatus = expectedMaritalStatus;
//     }

//     // Nationality filter
//     if (!expectedNationality.includes('ANY')) {
//       filterObj.nationality = {
//         $in: expectedNationality
//       };
//     }

//     // Children acceptance filter
//     if (childAccepted.toLowerCase() === 'yes') {
//       filterObj.children = { $not: { $size: 0 } };
//     } else if (childAccepted.toLowerCase() === 'no') {
//       filterObj.children = { $size: 0 };
//     }

//     // Religion filter
//     if (expectedReligion && expectedReligion.length > 0) {
//       const religionFilters = expectedReligion.map(rel => {
//         const filter = {};
//         if (rel.religion && rel.religion !== 'ANY') {
//           filter['caste.religion'] = rel.religion;
//         }
//         if (rel.caste && rel.caste !== 'ANY') {
//           filter['caste.caste'] = rel.caste;
//         }
//         if (rel.subCaste && rel.subCaste !== 'ANY') {
//           filter['caste.subCaste'] = rel.subCaste;
//         }
//         return filter;
//       });

//       if (religionFilters.length > 0) {
//         filterObj.$or = religionFilters;
//       }
//     }

//     // Native location filter
//     if (expectedNativeLocation && expectedNativeLocation.length > 0) {
//       const countryArray = expectedNativeLocation.map(ele => ele.country);
//       const stateArray = expectedNativeLocation.map(ele => ele.state);
//       const cityArray = expectedNativeLocation.map(ele => ele.city);

//       if (!countryArray.includes('ANY') && !stateArray.includes('ANY') && !cityArray.includes('ANY')) {
//         filterObj['nativeCity.country'] = { $in: countryArray };
//         filterObj['nativeCity.state'] = { $in: stateArray };
//         filterObj['nativeCity.city'] = { $in: cityArray };
//       } else if (!countryArray.includes('ANY') && !stateArray.includes('ANY') && cityArray.includes('ANY')) {
//         filterObj['nativeCity.country'] = { $in: countryArray };
//         filterObj['nativeCity.state'] = { $in: stateArray };
//       } else if (!countryArray.includes('ANY') && stateArray.includes('ANY') && cityArray.includes('ANY')) {
//         filterObj['nativeCity.country'] = { $in: countryArray };
//       }
//     }

//     // Working location filter
//     if (expectedWorkingLocation && expectedWorkingLocation.length > 0) {
//       const workCountryArray = expectedWorkingLocation.map(ele => ele.country);
//       const workStateArray = expectedWorkingLocation.map(ele => ele.state);
//       const workCityArray = expectedWorkingLocation.map(ele => ele.city);

//       if (!workCountryArray.includes('ANY') && !workStateArray.includes('ANY') && !workCityArray.includes('ANY')) {
//         filterObj.workLocation = {
//           $regex: new RegExp(workCityArray.join('|'), 'i')
//         };
//       }
//     }

//     console.log('Filter Object:', JSON.stringify(filterObj, null, 2));

//     // Get users who match current user's expectations
//     const oneWayUsers = await userModel.find(filterObj);

//     // STEP 2: Filter for mutual matching
//     const mutualMatches = [];

//     for (const potentialMatch of oneWayUsers) {
//       // Check if current user matches potential match's expectations
//       let isCurrentUserMatch = true;

//       // Age check - calculate current user's age
//       const currentUserAge = new Date().getFullYear() - new Date(currentUser.dob).getFullYear();
//       if (potentialMatch.ageFrom !== 'ANY' && potentialMatch.ageTo !== 'ANY') {
//         const minAge = parseInt(potentialMatch.ageFrom);
//         const maxAge = parseInt(potentialMatch.ageTo);
//         if (currentUserAge < minAge || currentUserAge > maxAge) {
//           isCurrentUserMatch = false;
//         }
//       }

//       // Height check
//       if (potentialMatch.heightFrom !== 'ANY' && potentialMatch.heightTo !== 'ANY') {
//         const minHeight = parseInt(potentialMatch.heightFrom);
//         const maxHeight = parseInt(potentialMatch.heightTo);
//         if (currentUser.height < minHeight || currentUser.height > maxHeight) {
//           isCurrentUserMatch = false;
//         }
//       }

//       // Education check
//       if (potentialMatch.expectedEducation && !potentialMatch.expectedEducation.includes('ANY')) {
//         const hasMatchingEducation = currentUser.education.some(edu =>
//           potentialMatch.expectedEducation.includes(edu)
//         );
//         if (!hasMatchingEducation) {
//           isCurrentUserMatch = false;
//         }
//       }

//       // Occupation check
//       if (potentialMatch.expectedOccupation && potentialMatch.expectedOccupation !== 'ANY') {
//         if (currentUser.occupation !== potentialMatch.expectedOccupation) {
//           isCurrentUserMatch = false;
//         }
//       }

//       // Monthly income check
//       if (potentialMatch.expectedMonthlyIncome && potentialMatch.expectedMonthlyIncome !== 'ANY') {
//         if (currentUser.monthlyIncome < potentialMatch.expectedMonthlyIncome) {
//           isCurrentUserMatch = false;
//         }
//       }

//       // Work abroad check
//       if (potentialMatch.expectedWorkAbroad && potentialMatch.expectedWorkAbroad !== 'ANY') {
//         if (currentUser.workAbroad !== potentialMatch.expectedWorkAbroad.toLowerCase()) {
//           isCurrentUserMatch = false;
//         }
//       }

//       // Divyang preference check
//       if (potentialMatch.divyangPrefer && potentialMatch.divyangPrefer !== 'ANY') {
//         if (currentUser.divyang !== potentialMatch.divyangPrefer.toLowerCase()) {
//           isCurrentUserMatch = false;
//         }
//       }

//       // Marital status check
//       if (potentialMatch.expectedMaritalStatus && potentialMatch.expectedMaritalStatus !== 'ANY') {
//         if (currentUser.maritalStatus !== potentialMatch.expectedMaritalStatus) {
//           isCurrentUserMatch = false;
//         }
//       }

//       // Nationality check
//       if (potentialMatch.expectedNationality && !potentialMatch.expectedNationality.includes('ANY')) {
//         const hasMatchingNationality = currentUser.nationality.some(nat =>
//           potentialMatch.expectedNationality.includes(nat)
//         );
//         if (!hasMatchingNationality) {
//           isCurrentUserMatch = false;
//         }
//       }

//       // Children acceptance check
//       if (potentialMatch.childAccepted && potentialMatch.childAccepted !== 'ANY') {
//         const currentUserHasChildren = currentUser.children && currentUser.children.length > 0;
//         if (potentialMatch.childAccepted.toLowerCase() === 'no' && currentUserHasChildren) {
//           isCurrentUserMatch = false;
//         }
//         if (potentialMatch.childAccepted.toLowerCase() === 'yes' && !currentUserHasChildren) {
//           isCurrentUserMatch = false;
//         }
//       }

//       // Religion check
//       if (potentialMatch.expectedReligion && potentialMatch.expectedReligion.length > 0) {
//         const hasMatchingReligion = potentialMatch.expectedReligion.some(expRel => {
//           if (expRel.religion && expRel.religion !== 'ANY' &&
//             currentUser.caste.religion !== expRel.religion) {
//             return false;
//           }
//           if (expRel.caste && expRel.caste !== 'ANY' &&
//             currentUser.caste.caste !== expRel.caste) {
//             return false;
//           }
//           if (expRel.subCaste && expRel.subCaste !== 'ANY' &&
//             currentUser.caste.subCaste !== expRel.subCaste) {
//             return false;
//           }
//           return true;
//         });
//         if (!hasMatchingReligion) {
//           isCurrentUserMatch = false;
//         }
//       }

//       // Native location check
//       if (potentialMatch.expectedNativeLocation && potentialMatch.expectedNativeLocation.length > 0) {
//         const hasMatchingNativeLocation = potentialMatch.expectedNativeLocation.some(expLoc => {
//           if (expLoc.country && expLoc.country !== 'ANY' &&
//             currentUser.nativeCity.country !== expLoc.country) {
//             return false;
//           }
//           if (expLoc.state && expLoc.state !== 'ANY' &&
//             currentUser.nativeCity.state !== expLoc.state) {
//             return false;
//           }
//           if (expLoc.city && expLoc.city !== 'ANY' &&
//             currentUser.nativeCity.city !== expLoc.city) {
//             return false;
//           }
//           return true;
//         });
//         if (!hasMatchingNativeLocation) {
//           isCurrentUserMatch = false;
//         }
//       }

//       // If current user matches potential match's expectations, add to mutual matches
//       if (isCurrentUserMatch) {
//         mutualMatches.push(potentialMatch);
//       }
//     }

//     console.log(`One-way matches: ${oneWayUsers.length}`);
//     console.log(`Mutual matches: ${mutualMatches.length}`);

//     return res.status(200).json({
//       status: true,
//       message: "Mutual matches found successfully",
//       totalMatches: mutualMatches.length,
//       oneWayMatches: oneWayUsers.length,
//       mutualMatches: mutualMatches.map(match => ({
//         _id: match._id,
//         UserId: match.UserId,
//         firstName: match.firstName,
//         lastName: match.lastName,
//         gender: match.gender,
//         age: new Date().getFullYear() - new Date(match.dob).getFullYear(),
//         height: match.height,
//         education: match.education,
//         occupation: match.occupation,
//         monthlyIncome: match.monthlyIncome,
//         workLocation: match.workLocation,
//         maritalStatus: match.maritalStatus,
//         nationality: match.nationality,
//         caste: match.caste,
//         motherTongue: match.motherTongue,
//         profilePic: match.profilePic,
//         premium: match.premium
//       }))
//     });

//   } catch (error) {
//     console.error('Error in mutual matching:', error);
//     return res.status(500).json({
//       status: false,
//       message: "Internal server error",
//       error: error.message
//     });
//   }
// }

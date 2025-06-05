import userModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import sendMail from "../utils/mail.js";
import jwt from "jsonwebtoken";
import envCredentials from "../config/env.js";
import expectationsModel from "../models/expectations.model.js";
import countryModel from "../models/country.model.js";
import stateModel from "../models/state.model.js";
import locationEntryModel from "../models/location.entry.js";


export const registerUser = async (req, res) => {
  try {
    const {
      loginEmail,
      loginNumber,
      password,
      firstName,
      middleName,
      lastName,
      gender,
      dob,
      birthTime,
      placeOfBirth,
      maritalStatus,
      height,
      occupation,
      designation,
      companyName,
      personalNo,
      workcity,
      workstate,
      monthlyIncome,
      nationality,
      caste,
      motherTongue,
      fatherName,
      motherName,
      mamkul,
      parentNumber,
      wpNo,
      alternateNo,
      brother,
      brotherText,
      sister,
      sisterText,
      divyang,
      education,
      addressHome,
      homecity,
      otherInfo,
      sect,
      manglik,
      gotra,
      foodChoices,
      spectacles,
      bloodGroup,
      complexion,
      profilePicStatus,
      // Partner Preferences
      ageFrom,
      ageTo,
      heightFrom,
      heightTo,
      partnerIncome,
      abroad,
      issue,
      partnerMaritalStatus,
      partnerNationality,
      partnerOccupation,
      partnerEducation,
      nativePlaceCities,
      nativePlaceStates,
      nativePlaceCountries,
      workingLocationCountries,
      workingLocationStates,
      workingLocationCities,
      religion,
      subCaste
    } = req.body;

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

    // Create user document
    const user = new userModel({
      loginEmail,
      loginNumber,
      password,
      firstName,
      middleName,
      lastName,
      gender,
      dob,
      birthTime,
      placeOfBirth,
      maritalStatus,
      height,
      occupation,
      designation,
      companyName,
      personalNo,
      workcity,
      workstate,
      monthlyIncome,
      nationality,
      caste,
      motherTongue,
      fatherName,
      motherName,
      mamkul,
      parentNumber,
      wpNo,
      alternateNo,
      brother,
      brotherText,
      sister,
      sisterText,
      divyang,
      education,
      addressHome,
      homecity,
      otherInfo,
      sect,
      manglik,
      gotra,
      foodChoices,
      spectacles,
      bloodGroup,
      complexion,
      userPhoto,
      profilePicStatus,
      // Partner Preferences
      ageFrom,
      ageTo,
      heightFrom,
      heightTo,
      partnerIncome,
      abroad,
      issue,
      partnerMaritalStatus,
      partnerNationality,
      partnerOccupation,
      partnerEducation,
      nativePlaceCities,
      nativePlaceStates,
      nativePlaceCountries,
      workingLocationCountries,
      workingLocationStates,
      workingLocationCities,
      religion,
      subCaste
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
      error: error.message,
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


export const getcountries = async (req, res) => {
  const countries = await countryModel.find();
  if (countries.length == 0) {
    return res.send({ status: false, message: "No countries found. Contact admin to add." })
  }
  return res.send({ status: true, result: countries })
}

export const getStates = async (req, res) => {
  const States = await stateModel.find();
  if (States.length == 0) {
    return res.send({ status: false, message: "No States found. Contact admin to add." })
  }
  return res.send({ status: true, result: States })
}

export const getLocationEntry = async (req, res) => {
  const locationEntry = await locationEntryModel.find({}, { _id: 0, __v: 0 });
  if (locationEntry.length == 0) {
    return res.send({ status: false, message: "No location found. Contact admin to add." })
  }
  return res.send({ status: true, result: locationEntry })
}

export const addExpectations = async (req, res) => {
  const findExpectation = await expectationsModel.findOne({ userId: req.id });

  try {
    if (!findExpectation) {
      const {
        ageFrom,
        ageTo,
        heightFrom,
        heightTo,
        partnerIncome,
        abroad,
        issue,
        partnerMaritalStatus,
        partnerNationality,
        partnerOccupation,
        partnerEducation,
        nativePlaceCities,
        nativePlaceStates,
        nativePlaceCountries,
        workingLocationCountries,
        workingLocationStates,
        workingLocationCities,
        religion,
        subCaste,
      } = req.body;

      try {
        const expectations = new expectationsModel({
          userId: req.id,
          ageFrom,
          ageTo,
          heightFrom,
          heightTo,
          partnerIncome,
          abroad,
          issue,
          partnerMaritalStatus,
          partnerNationality,
          partnerOccupation,
          partnerEducation,
          nativePlaceCities,
          nativePlaceStates,
          nativePlaceCountries,
          workingLocationCountries,
          workingLocationStates,
          workingLocationCities,
          religion,
          subCaste,
        });

        await expectations.save();
        return res.send({
          status: true,
          message: "Expectations Saved. Ready to match.",
        });
      } catch (error) {
        return res.send({ status: false, message: "Server Error" });
      }
    } else {
      return res.send({
        status: false,
        message: "Expectation already exists. Update it and match.",
      });
    }
  } catch (error) {
    return res.send({ status: false, message: "Something went wrong.Check your req data." })
  }
};

export const updateExpectation = async (req, res) => {

  const { updates } = req.body;
  if (!updates) {
    return res.send({ status: false, message: "No updates found for expectations." })
  }

  const userId = req.id;

  try {
    const exisitingExpectation = await expectationsModel.findOne({ userId });

    if (!exisitingExpectation) {
      return res.send({
        status: false,
        message: "Expectation does not exist",
      });
    }


    await expectationsModel.updateOne(
      { userId: exisitingExpectation.userId },
      { $set: updates },
      {
        new: true,
        runValidators: true,
      }
    );

    const updatedExpectation = await expectationsModel.findOne({ userId }, '-_id -userId -createdAt -updatedAt -__v')
    if (!updatedExpectation) {
      console.log(updateExpectation)
    }

    return res.send({ status: true, updatedData: updatedExpectation });
  } catch (error) {
    res.send({
      status: false,
      message: "Data not updated. Check your update data",
    });
  }
};

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
  if (!userId) {
    return res.send({ status: false, message: "User Id not found" });
  }
  const CurrentExpectation = await expectationsModel.findOne({ userId })

  const userLoggedIn = await userModel.findOne({ _id: userId })

  // console.log(userLoggedIn)

  const {
    matchMaritalSts,
    matchHeightFrom,
    matchHeightTo,
    matchOccu,
    matchIncome,
    matchCaste
  } = CurrentExpectation

  const expectatedUser = await userModel.findOne({
    maritalsts: matchMaritalSts,
    height: { $gte: matchHeightFrom, $lte: matchHeightTo },
    occupation: matchOccu,
    monthlyinc: matchIncome,
    caste: matchCaste,
  })
  console.log(expectatedUser)

}
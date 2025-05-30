import userModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import sendMail from "../utils/mail.js";
import jwt from "jsonwebtoken";
import envCredentials from "../config/env.js";
import expectationsModel from "../models/expectations.model.js";

export const registerUser = async (req, res) => {
  const {
    usName,
    contactLogin,
    password,
    fsname,
    mdname,
    lsname,
    gender,
    dob,
    time,
    placeofbirth,
    maritalsts,
    height,
    complexion,
    manglik,
    gotra,
    foodChoices,
    spects,
    divyang,
    education,
    occupation,
    jobPosition,
    companyOrgName,
    designation,
    monthlyinc,
    candidateNo,
    workaddress,
    workcity,
    workstate,
    fathername,
    mothername,
    mamkul,
    brother,
    sister,
    parentnumber,
    wpno,
    alternateno,
    email,
    parentaddress,
    parentcity,
    parentstate,
    nationality,
    caste,
    mothertongue,
    sect,
    socials,
    hobbies,
    matchAgeFrom,
    matchAgeTo,
    matchHeightFrom,
    matchHeightTo,
    prefEdu,
    matchOccu,
    matchMaritalSts,
    matchIncome,
    matchCaste,
    matchWorkLocCitDis,
    PartnerDesc,
    franchise,
    profilePicStatus,
  } = req.body;

  const findUser = await userModel.findOne({ email: email });

  if (findUser) {
    return res.send({ status: false, message: "User already exists!" });
  }

  if (!req.files?.profilePic) {
    return res.send({ status: false, message: "Please Upload profile pic" });
  }

  let profilePic = req.files?.profilePic[0].filename;

  try {
    const user = new userModel({
      usName: usName.trim(),
      contactLogin: contactLogin.trim(),
      password: password.trim(),
      fsname: fsname.trim(),
      mdname: mdname.trim(),
      lsname: lsname.trim(),
      gender: gender.trim(),
      dob,
      time: time.trim(),
      placeofbirth: placeofbirth.trim(),
      maritalsts: maritalsts.trim(),
      height: height.trim(),
      complexion: complexion.trim(),
      manglik: manglik.trim(),
      gotra: gotra.trim(),
      foodChoices: foodChoices.trim(),
      spects: spects.trim(),
      divyang: divyang.trim(),
      education: education,
      occupation: occupation.trim(),
      jobPosition: jobPosition.trim(),
      companyOrgName: companyOrgName.trim(),
      designation: designation.trim(),
      monthlyinc,
      candidateNo: candidateNo.trim(),
      workaddress: workaddress.trim(),
      workcity: workcity.trim(),
      workstate: workstate.trim(),
      fathername: fathername.trim(),
      mothername: mothername.trim(),
      mamkul: mamkul.trim(),
      brother,
      sister,
      parentnumber: parentnumber.trim(),
      wpno: wpno.trim(),
      alternateno: alternateno.trim(),
      parentaddress: parentaddress.trim(),
      parentcity: parentcity.trim(),
      parentstate: parentstate.trim(),
      nationality: nationality.trim(),
      caste: caste.trim(),
      mothertongue: mothertongue.trim(),
      sect: sect.trim(),
      socials: socials.trim(),
      hobbies: hobbies,
      matchAgeFrom,
      matchAgeTo,
      matchHeightFrom: matchHeightFrom.trim(),
      matchHeightTo: matchHeightTo.trim(),
      prefEdu: prefEdu.trim(),
      matchOccu: matchOccu.trim(),
      matchMaritalSts: matchMaritalSts.trim(),
      matchIncome: matchIncome.trim(),
      matchCaste: matchCaste.trim(),
      matchWorkLocCitDis: matchWorkLocCitDis.trim(),
      franchise: franchise.trim(),
      profilePic,
    });

    await user.save();

    return res.send({
      status: true,
      success: true,
      message: "User registered successfully.",
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: false,
      success: false,
      message: "Server Error!",
      error: error,
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.send({
      status: false,
      message: "Invalid Credentials. All Fields Required.",
    });
  }

  try {
    const findUser = await userModel.findOne({ contactLogin: email });
    if (!findUser) {
      return res.send({
        status: false,
        message: "User Not Found. Check username and password again",
      });
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

export const addExpectations = async (req, res) => {
  const findExpectation = await expectationsModel.findOne({ userId: req.id });

  try {
    if (!findExpectation) {
      const {
        matchAgeFrom,
        matchAgeTo,
        matchHeightFrom,
        matchHeightTo,
        prefEdu,
        matchOccu,
        matchMaritalSts,
        matchIncome,
        matchCaste,
        matchWorkLocCitDis,
        sect,
        manglik,
        gotra,
        foodChoices,
        spects
      } = req.body;

      try {
        const expectations = new expectationsModel({
          userId: req.id,
          matchAgeFrom,
          matchAgeTo,
          matchHeightFrom,
          matchHeightTo,
          prefEdu,
          matchOccu,
          matchMaritalSts,
          matchIncome,
          matchCaste,
          matchWorkLocCitDis,
          sect,
          manglik,
          gotra,
          foodChoices,
          spects
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

  const expectatedUser = await userModel.findOne({
    maritalsts: CurrentExpectation.matchMaritalSts,
    height: (CurrentExpectation.matchHeightFrom < CurrentExpectation.matchHeightTo),
    occupation: CurrentExpectation.matchOccu,
    monthlyinc: CurrentExpectation.matchIncome,
    caste: CurrentExpectation.matchCaste,
  })

  console.log(expectatedUser)
}
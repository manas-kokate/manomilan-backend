import userModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import sendMail from "../utils/mail.js";
import jwt from "jsonwebtoken";
import envCredentials from "../config/env.js";
import expectationsModel from "../models/expectations.model.js";
import { validationResult } from "express-validator";

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

    res.send({
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

export const getUsers = async (req, res) => {
  if (!req.id) {
    return res.send({ status: false, message: "Unauthorized user" });
  }

  const findUsers = await userModel.find({}, "-_id -password -email -__v");
  if (!findUsers) {
    return res.send({ status: false, message: "No users found" });
  }

  return res.send({ status: true, users: findUsers });
};

export const addExpectations = async (req, res) => {
  const findExpectation = await expectationsModel.findOne({ userId: req.id });

  if (!findExpectation) {
    const {
      martialStatus,
      currentResidence,
      height,
      education,
      occupation,
      monthlyIncome,
      nationality,
      religion,
    } = req.body;

    try {
      const expectations = new expectationsModel({
        userId: req.id,
        martialStatus,
        currentResidence,
        height,
        education,
        occupation,
        monthlyIncome,
        nationality,
        religion,
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
};

export const updateExpectation = async (req, res) => {
  const errors = validationResult(req);
  if (errors.array().length !== 0) {
    return res.send({ status: false, message: errors.array() });
  }

  try {
    const updates = req.body;
    const userId = req.id;

    const exisitingExpectation = await expectationsModel.findOne({ userId });

    if (!exisitingExpectation) {
      return res.send({
        status: false,
        message: "Expectation does not exist",
      });
    }

    const updatedExpectation = await expectationsModel.updateOne(
      { userId: exisitingExpectation.userId },
      { $set: updates },
      {
        new: true,
        runValidators: true,
      }
    );

    return res.send({ status: true, updatedData: updatedExpectation });
  } catch (error) {
    res.send({
      status: false,
      message: "Data not updated. Check your update data",
    });
  }
};

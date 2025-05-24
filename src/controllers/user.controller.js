import userModel from "../models/user.model.js";
import bcrypt from "bcrypt"
import sendMail from "../utils/mail.js";
import jwt from "jsonwebtoken"
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

  } = req.body

  const findUser = await userModel.findOne({ email: email });

  if (findUser) {
    return res.send({ message: "user already exists!" })
  }


  if (!req.files?.profilePic) {
    return res.send({ message: "Please Upload profile pic" })
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
      dob, // usually a Date, so no trim
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
      education: education.trim(),
      occupation: occupation.trim(),
      jobPosition: jobPosition.trim(),
      companyOrgName: companyOrgName.trim(),
      designation: designation.trim(),
      monthlyinc, // Number, no trim
      candidateNo: candidateNo.trim(),
      workaddress: workaddress.trim(),
      workcity: workcity.trim(),
      workstate: workstate.trim(),
      fathername: fathername.trim(),
      mothername: mothername.trim(),
      mamkul: mamkul.trim(),
      brother, // Number, no trim
      sister,  // Number, no trim
      parentnumber: parentnumber.trim(),
      wpno: wpno.trim(),
      alternateno: alternateno.trim(),
      email: email.trim(),
      parentaddress: parentaddress.trim(),
      parentcity: parentcity.trim(),
      parentstate: parentstate.trim(),
      nationality: nationality.trim(),
      caste: caste.trim(),
      mothertongue: mothertongue.trim(),
      sect: sect.trim(),
      socials: socials.trim(),
      hobbies: hobbies.trim(),
      matchAgeFrom, // Number, no trim
      matchAgeTo,   // Number, no trim
      matchHeightFrom: matchHeightFrom.trim(),
      matchHeightTo: matchHeightTo.trim(),
      prefEdu: prefEdu.trim(),
      matchOccu: matchOccu.trim(),
      matchMaritalSts: matchMaritalSts.trim(),
      matchIncome: matchIncome.trim(),
      matchCaste: matchCaste.trim(),
      matchWorkLocCitDis: matchWorkLocCitDis.trim(),
      PartnerDesc: PartnerDesc.trim(),
      franchise: franchise.trim(),
      profilePic, // Probably a file or Buffer, no trim
      profilePicStatus: profilePicStatus.trim(),
    });
    await user.save()

    await sendMail({
      to: email,
      from: "Manomilan Registration",
      text: "Welcome! You Registered successfully",
      html: `
            <html>
  <head>
    <style>
      @media only screen and (max-width: 600px) {
        .email-container {
          width: 100% !important;
          padding: 20px !important;
        }
        .button {
          width: 100% !important;
          box-sizing: border-box;
        }
      }
    </style>
  </head>
  <body style="margin:0; padding:0; font-family:Arial, sans-serif; background-color:#f4f4f4;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f4f4; padding:20px 0;">
      <tr>
        <td align="center">
          <table class="email-container" width="600" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff; padding:30px; border-radius:8px; box-shadow:0 2px 5px rgba(0,0,0,0.1); width:600px;">
            <tr>
              <td style="text-align:center; padding-bottom:20px;">
                <h2 style="color:#333333; margin:0;">Registration Successful</h2>
              </td>
            </tr>
            <tr>
              <td style="color:#555555; font-size:16px; line-height:1.6;">
                <p style="margin:0 0 20px;">Hi ${usName},</p>
                <p style="margin:0 0 20px;">
                  Thanks for registering at manomilan! Your account has been created successfully.
                </p>
                <p style="margin:0 0 20px;">
                  You can now log in and start using our services.
                </p>
                <div style="text-align:center; margin:30px 0;">
                  <a href="https://yourwebsite.com/login"
                     class="button"
                     style="background-color:#4CAF50; color:#ffffff; padding:12px 25px; text-decoration:none; border-radius:4px; display:inline-block; font-weight:bold;">
                    Go to Dashboard
                  </a>
                </div>
                <p style="margin:0 0 10px;">If you didn’t sign up, just ignore this email.</p>
                <p style="margin:0;">Cheers,<br><strong>manomilan</strong></p>
              </td>
            </tr>
            <tr>
              <td style="text-align:center; padding-top:30px; font-size:12px; color:#999999;">
                &copy; 2025 Manomilan. All rights reserved.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
            `})

    res.send({
      success: true,
      message: "User registered successfully."
    })
  } catch (error) {
    // console.log(error)
    res.send({
      success: false,
      message: "Server Error!",
      error: error
    })
  }
}

export const login = async (req, res) => {

  const { email, password } = req.body;

  if (!email || !password) {
    return res.send({ message: "Invalid Credentials.All Fields Required." })
  }


  try {
    const findUser = await userModel.findOne({ email: email });
    if (!findUser) {
      return res.send({ message: "User Not Found.Check username and password again" })
    }

    const PasswordValidate = await bcrypt.compare(password, findUser.password)

    if (!PasswordValidate) {
      return res.send({ message: "Wrong Password" })
    }

    const token = jwt.sign({ id: findUser._id }, envCredentials.secretKey, { expiresIn: '1h' });

    res.send({
      success: true,
      message: "User Logged in successfully",
      token: token
    })


  } catch (error) {
    return res.send({ message: "Server Error" })
  }
}

export const getUsers = async (req, res) => {
  if (!req.id) {
    return res.send({ message: "Unauthorized user" });
  }
  const findUsers = await userModel.find({}, '-_id -password -email -__v',);
  if (!findUsers) {
    return res.send({ message: "No users found" })
  }
  return res.send({ users: findUsers })
}

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
      religion
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
        religion
      })

      await expectations.save()
      return res.send({ message: "Expectations Saved.Ready to match." })
    } catch (error) {
      return res.send({ message: "Server Error" })
    }
  } else {
    return res.send({ message: "Expectation already exists.Update it and match." })
  }
}

export const updateExpectation = async (req, res) => {
  const errors = validationResult(req);
  if (errors.array().length !== 0) {
    console.log(errors.array())
    return res.send({ message: errors.array() });
  }

  try {
    const updates = req.body;
    console.log(updates)
    console.log(req.id)
    const userId = req.id

    const exisitingExpectation = await expectationsModel.findOne({ userId })

    if (!exisitingExpectation) {
      return res.send({ message: "expectation Do not exist" })
    }

    const updatedExpectation = await expectationsModel.updateOne({ userId: exisitingExpectation.userId }, { $set: updates }, {
      new: true,
      runValidators: true
    })

    // console.log(updatedExpectation)
    return res.send({ updatedData: updatedExpectation })


  } catch (error) {
    res.send({ message: "Data not updated.Check your update data" })
  }
}
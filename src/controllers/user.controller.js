import userModel from "../models/user.model.js";
import bcrypt from "bcrypt"
import sendMail from "../utils/mail.js";
import jwt from "jsonwebtoken"
import envCredentials from "../config/env.js";


export const registerUser = async (req, res) => {
  const {
    name,
    gender,
    martialStatus,
    dateOfBirth,
    timeOfBirth,
    placeOfBirth,
    height,
    education,
    occupation,
    monthlyIncome,
    nationality,
    religion,
    caste,
    subCaste,
    motherTongue,
    fatherFname,
    motherFname,
    maternalSurname,
    NumOfBrother,
    NumOfSister,
    sector,
    foodChoice,
    spects,
    divyang,
    email,
    parentsAddress,
    mobile1,
    password
  } = req.body

  const findUser = await userModel.findOne({ email: email });

  if (findUser) {
    return res.send({ message: "user already exists!" })
  }


  if (!req.files?.profilePic) {
    return res.send({ message: "Please Upload profile pic" })
  }
  let profilePic = req.files?.profilePic[0].filename;
  // console.log(profilePic)
  try {
    const user = new userModel({
      name,
      gender,
      martialStatus,
      dateOfBirth,
      timeOfBirth,
      placeOfBirth,
      height,
      education,
      occupation,
      monthlyIncome,
      nationality,
      religion,
      caste,
      subCaste,
      motherTongue,
      fatherFname,
      motherFname,
      maternalSurname,
      NumOfBrother,
      NumOfSister,
      sector,
      foodChoice,
      spects,
      divyang,
      email,
      parentsAddress,
      mobile1,
      password,
      profilePic
    })
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
                <p style="margin:0 0 20px;">Hi ${name},</p>
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
    console.log(error)
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
      message: "Captain Logged in successfully",
      token: token
    })


  } catch (error) {
    return res.send({ message: "Server Error" })
  }
}

export const getUsers = async (req, res) => {
  const findUsers = await userModel.find({}, '-_id -password -email -__v',);
  if (!findUsers) {
    return res.send({ message: "No users found" })
  }
  return res.send({ users: findUsers })
}

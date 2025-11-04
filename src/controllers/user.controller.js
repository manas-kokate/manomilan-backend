import userModel from "../models/user.model.js";
import sendMail from "../utils/mail.js";
import jwt from "jsonwebtoken";
import envCredentials from "../config/env.js";
import franchiseModel from "../models/franchise.model.js";
import MessageModel from "../models/small_models/Message.model.js";
import adminModel from "../models/admin.model.js";
import distributorModel from "../models/distributor.model.js";
import freepackageModel from "../models/small_models/freepackage.model.js";
import vipPackageModel from "../models/small_models/vipPackage.model.js";
import addOnPackageModel from "../models/small_models/addOnPackage.model.js";
import mainPackageModel from "../models/small_models/mainPackage.model.js";
import userPackageTrackModel from "../models/small_models/userPackageTrack.model.js";
import otpModel from "../models/small_models/otp.model.js";

export const registerUser = async (req, res) => {
  // try {
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

  // Active free package 
  const freePackage = await freepackageModel.findOne({ status: 'Active' })

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
    children: typeof children === 'string' ? JSON.parse(children) : '',
    height,
    occupation,
    monthlyIncome,
    nationality: nationality || ["India"],
    caste: JSON.parse(caste) || '', // assumed to be { religion, caste, subCaste } 
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
    nativeCity: JSON.parse(nativeCity) || '', // { country, state, city }
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
    numberOfAddresses: freePackage.NumOfFreeAddress
  });

  const SavedNewUser = await user.save();

  const newPackageLog = new userPackageTrackModel({
    userId: SavedNewUser._id,
    freeAddresses: freePackage.NumOfFreeAddress,
    freePackage: freePackage._id
  })
  await newPackageLog.save()
  // send mail to user
  sendMail({
    to: user.loginEmail,
    subject: "Welcome to ManoMilan – Your Registration Details",
    text: "Thank you for registering at ManoMilan.",
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Welcome to ManoMilan</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background: linear-gradient(135deg, #7d0a0a 0%, #a81313 100%);
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }
    .email-container {
      max-width: 600px;
      background: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
      margin: 20px;
    }
    .header {
      background: linear-gradient(135deg, #7d0a0a 0%, #a81313 100%);
      padding: 30px;
      text-align: center;
      color: white;
    }
    .header h1 {
      margin: 0;
      font-size: 26px;
      font-weight: 600;
    }
    .content {
      padding: 40px 30px;
      text-align: center;
    }
    .content p {
      font-size: 16px;
      color: #444;
      line-height: 1.5;
      margin-bottom: 20px;
    }
    .credentials-box {
      background: #f8f8f8;
      padding: 20px;
      border-radius: 12px;
      margin-bottom: 30px;
      border: 1px dashed #7d0a0a;
    }
    .credentials-box p {
      margin: 6px 0;
      font-weight: 600;
    }
    .login-button {
      background: #7d0a0a;
      color: white;
      text-decoration: none;
      padding: 12px 24px;
      border-radius: 8px;
      display: inline-block;
      font-weight: 600;
    }
    .footer {
      background: #f9f9f9;
      padding: 20px;
      text-align: center;
      font-size: 14px;
      color: #999;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>Welcome to ManoMilan</h1>
    </div>
    <div class="content">
      <p>Hi <strong>${user.firstName} ${user.midname} ${user.lastName}</strong>,</p>
      <p>Thanks for registering with ManoMilan. Below are your login credentials:</p>
      <div class="credentials-box">
        <p>Email: ${user.loginEmail}</p>
        <p>Password:${password}</p>
      </div>
    </div>
    <div class="footer">
      &copy; 2025 ManoMilan Matrimony
    </div>
  </div>
</body>
</html>
`
  })

  const franchise = await franchiseModel.findOne({ franchiseName: SavedNewUser.franchiseUnder });
  // send mail to franchise 
  sendMail({
    to: franchise.email,
    subject: `New User Registered - ${user.loginEmail}`,
    text: `A new user has registered.\n\nName:${user.loginEmail}\nPassword: ${password}`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>New User Registered</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background: linear-gradient(135deg, #7d0a0a 0%, #a81313 100%);
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }
    .email-container {
      max-width: 600px;
      background: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
      margin: 20px;
    }
    .header {
      background: linear-gradient(135deg, #7d0a0a 0%, #a81313 100%);
      padding: 30px;
      text-align: center;
      color: white;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .content {
      padding: 40px 30px;
      text-align: center;
    }
    .content p {
      font-size: 16px;
      color: #444;
      line-height: 1.5;
      margin-bottom: 20px;
    }
    .info-box {
      background: #f8f8f8;
      padding: 20px;
      border-radius: 12px;
      margin-bottom: 30px;
      border: 1px dashed #7d0a0a;
      text-align: left;
    }
    .info-box p {
      margin: 8px 0;
      font-weight: 500;
    }
    .footer {
      background: #f9f9f9;
      padding: 20px;
      text-align: center;
      font-size: 14px;
      color: #999;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>New User Registered</h1>
    </div>
    <div class="content">
      <p>A new user has registered under your franchise.</p>
      <div class="info-box">
        <p><strong>Full Name:</strong> ${user.firstName} ${user.midname || ''} ${user.lastName}</p>
        <p><strong>Email:</strong> ${user.loginEmail}</p>
        <p><strong>Password:</strong> ${password}</p>
      </div>
      <p>Please ensure their onboarding and support process is followed as per franchise protocols.</p>
    </div>
    <div class="footer">
      &copy; 2025 ManoMilan Franchise Portal
    </div>
  </div>
</body>
</html>
`
  });

  return res.status(200).send({
    status: true,
    message: "User registered successfully.",
    user: SavedNewUser,
    packageLog: newPackageLog,
  });
  // } catch (error) {
  //   return res.status(500).send({
  //     status: false,
  //     message: "Server Error",
  //   });
  // }
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
    if (!findUser.ActiveStatus) {
      return res.send({ status: false, message: "This account is inactive.Please register and create new account." })
    }

    if (Number(password) != findUser.password) {
      return res.send({ status: false, message: "Wrong Password" });
    }

    const token = jwt.sign(
      { id: findUser._id },
      envCredentials.secretKey,
      { expiresIn: "4h" }
    );

    // // Static path for photos
    // const baseUrl = `${req.protocol}://${req.get('host')}`
    // const profilePic = findUser.profilePic ? `${baseUrl}/upload/${findUser.profilePic}` : "";
    // const userPhotoOne = findUser.userPhotoOne ? `${baseUrl}/upload/${findUser.userPhotoOne}` : "";
    // const userPhotoTwo = findUser.userPhotoTwo ? `${baseUrl}/upload/${findUser.userPhotoTwo}` : "";
    // const userPhotoThree = findUser.userPhotoThree ? `${baseUrl}/upload/${findUser.userPhotoThree}` : "";
    // const userPhotoFour = findUser.userPhotoFour ? `${baseUrl}/upload/${findUser.userPhotoFour}` : "";
    // const userPhotoFive = findUser.userPhotoFive ? `${baseUrl}/upload/${findUser.userPhotoFive}` : "";
    // const userPhotoSix = findUser.userPhotoSix ? `${baseUrl}/upload/${findUser.userPhotoSix}` : "";

    return res.send({
      status: true,
      message: "User Logged in successfully",
      token: token,
      User: findUser,
    });
  } catch (error) {
    return res.send({ status: false, message: "Server Error" });
  }
};

export const getOtpForUser = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.send({ status: false, message: "email required" });

  const user = await userModel.findOne({ loginEmail: email });
  const id = user._id
  if (!user) return res.send({ status: false, message: "User not found.Check email you entered." });

  const otp = Math.floor(100000 + Math.random() * 900000);
  await otpModel.create({ id, otp });

  await sendMail({
    to: user.loginEmail,
    subject: "OTP for User Password Reset",
    text: "Your OTP Code for Verification",
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Your OTP Code</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .email-container {
      max-width: 500px;
      margin: 20px;
      background: #ffffff;
      border-radius: 16px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      position: relative;
    }
    .header {
      background: linear-gradient(135deg, #007BFF 0%, #0056b3 100%);
      padding: 30px;
      text-align: center;
      color: white;
      position: relative;
    }
    .header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="2"/></svg>') no-repeat center;
      background-size: 80px 80px;
      opacity: 0.3;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 600;
      position: relative;
      z-index: 1;
    }
    .lock-icon {
      width: 60px;
      height: 60px;
      margin: 0 auto 20px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      z-index: 1;
    }
    .content {
      padding: 40px 30px;
      text-align: center;
    }
    .greeting {
      font-size: 18px;
      color: #333;
      margin-bottom: 10px;
      font-weight: 500;
    }
    .description {
      font-size: 16px;
      color: #666;
      margin-bottom: 30px;
      line-height: 1.5;
    }
    .otp-container {
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      border: 2px dashed #007BFF;
      border-radius: 12px;
      padding: 25px;
      margin: 30px 0;
      position: relative;
    }
    .otp-label {
      font-size: 14px;
      color: #666;
      margin-bottom: 10px;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: 600;
    }
    .otp-code {
      font-size: 36px;
      font-weight: 700;
      color: #007BFF;
      letter-spacing: 8px;
      font-family: 'Courier New', monospace;
      margin: 0;
      text-shadow: 0 2px 4px rgba(0, 123, 255, 0.2);
    }
    .expiry-info {
      background: #fff3cd;
      border: 1px solid #ffeaa7;
      border-radius: 8px;
      padding: 15px;
      margin: 25px 0;
    }
    .expiry-info p {
      margin: 0;
      color: #856404;
      font-size: 14px;
      font-weight: 500;
    }
    .timer-icon {
      display: inline-block;
      width: 16px;
      height: 16px;
      margin-right: 8px;
      vertical-align: middle;
    }
    .footer {
      background: #f8f9fa;
      padding: 25px 30px;
      border-top: 1px solid #e9ecef;
    }
    .signature {
      color: #666;
      font-size: 16px;
      line-height: 1.6;
    }
    .company-name {
      color: #007BFF;
      font-weight: 600;
      font-size: 18px;
    }
    .security-note {
      font-size: 12px;
      color: #999;
      margin-top: 20px;
      padding-top: 15px;
      border-top: 1px solid #e9ecef;
      line-height: 1.4;
    }
    @media (max-width: 600px) {
      .email-container {
        margin: 10px;
      }
      .content {
        padding: 30px 20px;
      }
      .header {
        padding: 25px 20px;
      }
      .otp-code {
        font-size: 28px;
        letter-spacing: 6px;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <div class="lock-icon">
        <svg width="30" height="30" fill="white" viewBox="0 0 24 24">
          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
        </svg>
      </div>
      <h1>Verification Code</h1>
    </div>
    <div class="content">
      <p class="greeting">Hello User,</p>
      <p class="description">
        A secure one-time password (OTP) has been generated for your ManoMilan account. Use the code below to reset your password.
      </p>
      <div class="otp-container">
        <div class="otp-label">Your OTP Code</div>
        <h2 class="otp-code">${otp}</h2>
      </div>
      <div class="expiry-info">
        <p>
          <svg class="timer-icon" fill="#856404" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/>
          </svg>
          This code will expire in <strong>10 minutes</strong>.
        </p>
      </div>
    </div>
    <div class="footer">
      <div class="signature">
        <p>Best regards,</p>
        <p class="company-name">ManoMilan</p>
      </div>
      <div class="security-note">
        <strong>Security Notice:</strong> Never share this code with anyone. If you didn't request this code, please contact ${user.loginEmail}.
      </div>
    </div>
  </div>
</body>
</html>
  `
  });

  return res.send({ status: true, message: "OTP sent to email." });
};

export const verifyOtpAndChangeUserPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body; // send email , otp and newpassword
  if (!email || !otp || !newPassword)
    return res.send({ status: false, message: "All fields required." });

  const user = await userModel.findOne({ loginEmail: email });
  const id = user._id;

  const otpEntry = await otpModel.findOne({ id }).sort({ createdAt: -1 });
  if (!otpEntry) return res.send({ status: false, message: "OTP not found." });

  const isExpired = new Date() - new Date(otpEntry.createdAt) > 10 * 60 * 1000;
  if (isExpired) return res.send({ status: false, message: "OTP expired." });

  if (parseInt(otp) !== otpEntry.otp)
    return res.send({ status: false, message: "Incorrect OTP." });

  await userModel.findByIdAndUpdate(id, { password: Number(newPassword) });
  await otpModel.deleteMany({ id });

  return res.send({ status: true, message: "Password updated successfully." });
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

  const finUpdatedUser = await userModel.findById(userId, '-password -__v -updatedAt -createdAt');

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

    const oneWayMatches = await userModel.find(finalQuery).lean().sort({ createdAt: -1 });

    // Mutual matching
    const mutualMatches = [];
    for (const match of oneWayMatches) {
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
      const mutual = await userModel.findOne(reverseQuery).lean();
      if (mutual) {
        mutualMatches.push(match);
      }
    }
    return res.status(200).send({ status: true, Matches: mutualMatches });
  } catch (err) {
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
    return res.status(500).send({
      status: false,
      message: "Server error",
    });
  }
}

export const inActivateUser = async (req, res) => {
  try {
    const { reason, adminId, userId } = req.body;
    const user = await userModel.findById(userId);
    if (!user) {
      return res.send({ status: false, message: "User not found." })
    }
    if (!reason) {
      return res.send({ status: false, message: "Please provide reason for deactivating account." })
    }
    const admin = await adminModel.findById(adminId);
    user.ActiveStatus = false;
    await user.save();
    sendMail({
      to: admin.email,
      subject: "User Account Self-Deactivation Notice – ManoMilan",
      text: "A user has deactivated their ManoMilan account.",
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>User Self-Deactivated Account</title>
  <style>
    /* --- same styles unchanged --- */
    body { margin:0; padding:0; background:linear-gradient(135deg,#7d0a0a 0%,#a81313 100%); font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif; display:flex; justify-content:center; align-items:center; min-height:100vh; }
    .email-container { max-width:600px; background:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 20px 40px rgba(0, 0, 0, 0.15); margin:20px; }
    .header { background:linear-gradient(135deg,#7d0a0a 0%,#a81313 100%); padding:30px; text-align:center; color:white; }
    .header h1 { margin:0; font-size:26px; font-weight:600; }
    .content { padding:40px 30px; text-align:center; }
    .content p { font-size:16px; color:#444; line-height:1.5; margin-bottom:20px; }
    .credentials-box { background:#f8f8f8; padding:20px; border-radius:12px; margin-bottom:30px; border:1px dashed #7d0a0a; }
    .credentials-box p { margin:6px 0; font-weight:600; }
    .footer { background:#f9f9f9; padding:20px; text-align:center; font-size:14px; color:#999; }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>User Self-Deactivated Account</h1>
    </div>
    <div class="content">
      <p><strong>${user.firstName} ${user.midname} ${user.lastName}</strong> has voluntarily deactivated their ManoMilan account.</p>
      
      <div class="credentials-box">
        <p><strong>User Email:</strong> ${user.loginEmail}</p>
        <p><strong>Reason Provided:</strong>${reason}</p> <!-- req.body.reason goes here -->
      </div>

      <p>This is for your information. No action is required unless follow-up is needed.</p>
    </div>
    <div class="footer">
      &copy; 2025 ManoMilan Matrimony
    </div>
  </div>
</body>
</html>
`
    })
    return res.send({ status: true, message: "User deactivated successfully." })
  }
  catch (error) {
    console.log(error)
    return res.send({ status: false, message: "Server error" })
  }
}
// === SUBSCRIBE ===
export const subscribe = async (req, res) => {
  try {
    const userId = req.id;
    const { subscribeUserId } = req.body;

    if (!subscribeUserId) {
      return res.status(400).json({ status: false, message: "Subscriber user ID not provided." });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ status: false, message: "User not found." });
    }

    const validityDate = new Date(user.validity);
    const currentDate = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));

    // Check if user's package is expired
    if (currentDate > validityDate) {
      return res.status(403).json({ status: false, message: "Your package validity has expired. Please purchase a new package." });
    }

    // Check if user has any valid addresses (paid or free)
    if (user.numberOfAddresses <= 0 && user.freeAddresses <= 0) {
      return res.status(403).json({ status: false, message: "You don't have any address credits to subscribe." });
    }

    // Prevent duplicate subscriptions
    if (user.subscribes.includes(subscribeUserId)) {
      return res.status(409).json({ status: false, message: "Already subscribed to this user." });
    }

    // Prioritize using paid address credits
    if (user.numberOfAddresses > 0) {
      user.numberOfAddresses -= 1;
    } else if (user.freeAddresses > 0) {
      user.freeAddresses -= 1;
    }

    user.subscribes.push(subscribeUserId);

    await user.save();

    return res.status(200).json({ status: true, message: "Subscribed successfully." });

  } catch (error) {
    return res.status(500).json({ status: false, message: "Server error." });
  }
};

export const subscribed = async (req, res) => {
  try {
    const userId = req.id;
    const user = await userModel.findById(userId).populate('subscribes');
    const subscribed = user.subscribes;
    return res.send({ status: true, subscribed })
  } catch (error) {
    return res.send({ status: false, message: "Server error" })
  }
}

// === MESSAGES ===
export const getFrachiseAndDistributorAndAdmin = async (req, res) => {
  try {
    const franchiseUnder = req.params.franchiseUnder;
    const franchise = await franchiseModel.findOne({ franchiseName: franchiseUnder })
    const distributor = await distributorModel.findOne({ distributorName: franchise.distributorUnder })
    const admin = await adminModel.find({}, '-points -transactionPassword -givePointsPassword -password -__v -createdAt -updatedAt')
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

// === PACKAGES ===
export const getUserPackages = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.send({ status: false, message: "User ID not found" })
    }
    const userPackages = await userPackageTrackModel.find({ userId }).populate({
      path: 'franchisePackage',
      populate: [
        { path: 'mainPackageId' },
        { path: 'vipPackage' },
        { path: 'addOnPackage' }
      ]
    }).sort({ createdAt: -1 })

    return res.send({ status: true, userPackages })

  } catch (error) {
    return res.send({ status: false, message: "server error" })
  }
}

export const getAvailablePackages = async (req, res) => {
  try {
    const packages = [];
    const mainPackages = await mainPackageModel.find({ status: 'Active' });
    const vipPackages = await vipPackageModel.find({ status: 'Active' });
    const addOnPackages = await addOnPackageModel.find({ status: 'Active' });
    packages.push({ ...mainPackages, ...vipPackages, ...addOnPackages });
    return res.send({ status: true, packages });
  } catch (error) {
    return res.send({ status: false, message: "Server error" });
  }
}

export const checkUserExists = async (req, res) => {
  try {
    const { mobileNo, dob, name } = req.body;
    if (!mobileNo || !dob || !name) {
      return res.send({ status: false, message: "All fields are required" })
    }
    const fname = name.split(' ')[0]
    const mname = name.split(' ')[1]
    const lname = name.split(' ')[2]
    if (await userModel.findOne({ loginEmail: mobileNo, dob: new Date(dob), firstName: fname, midname: mname, lastName: lname })) {
      return res.send({ status: true, message: "User exists" })
    }
    return res.send({ status: false, message: "User not found" })
  }
  catch (error) {
    return res.send({ status: false, message: "Server error" })
  }
}



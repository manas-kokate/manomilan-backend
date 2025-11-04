import franchiseModel from "../models/franchise.model.js";
import userModel from "../models/user.model.js"
import jwt from "jsonwebtoken";
import envCredentials from "../config/env.js";
import distributorModel from "../models/distributor.model.js";
import MessageModel from "../models/small_models/Message.model.js";
import adminModel from "../models/admin.model.js";
import userPackageTrackModel from "../models/small_models/userPackageTrack.model.js";
import franchisePackageModel from "../models/small_models/franchise.package.model.js";
import franchisePointsLogModel from "../models/small_models/franchisePointsLog.model.js";
import distributorpointslogModel from "../models/small_models/distributorpointslog.model.js";
import sendMail from "../utils/mail.js";
import otpModel from "../models/small_models/otp.model.js";
import freepackageModel from "../models/small_models/freepackage.model.js";

export const registerFranchise = async (req, res) => {
  const distributorId = req.id;
  const {
    franchiseName,
    ownerName,
    mobileNumber,
    alternateNumber,
    adharNumber,
    panNumber,
    password,
    email,
    address,
    location,
    socialMedia
  } = req.body;

  if (!franchiseName || !ownerName || !mobileNumber || !adharNumber || !panNumber || !email || !address) {
    return res.send({ status: false, message: "All fields required" })
  }

  const existingUser = await franchiseModel.findOne({
    $or: [{ adharNumber }, { panNumber }, { email }, { mobileNumber }]
  })

  if (existingUser) {
    return res.send({ status: false, message: "Sorry user already exists." })
  }

  let franchisePhoto = '';
  let qrPhoto = '';
  try {
    if (
      (req.files?.franchisePhoto || req.files.franchisePhoto.length !== 0) && (req.files?.qrPhoto || req.files.qrPhoto.length !== 0)) {
      franchisePhoto = req.files.franchisePhoto[0].filename;
      qrPhoto = req.files.qrPhoto[0].filename;
    }
  } catch (error) {
    franchisePhoto = '';
    qrPhoto = '';
  }


  try {
    const currentDistributor = await distributorModel.findById(distributorId);
    const newSchema = new franchiseModel({
      franchiseName,
      ownerName,
      distributorUnder: currentDistributor.distributorName,
      mobileNumber,
      alternateNumber,
      adharNumber,
      panNumber,
      password,
      email,
      address,
      location,
      socialMedia,
      franchisePhoto,
      qrPhoto
    })
    await newSchema.save()
    sendMail({
      to: newSchema.email,
      subject: "Welcome to ManoMilan - Your Registration Details",
      text: "You are the new franchise at ManoMilan.",
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
              <p>Hi <strong>${newSchema.franchiseName}</strong>,</p>
              <p>Thanks for registering with ManoMilan. Below are your login details:</p>
              <div class="credentials-box">
        <p>email:${email}</p>
        <p>franchiseName:${franchiseName}</p>
        <p>ownerName:${ownerName}</p>
        <p>distributorUnder:${newSchema.distributorUnder}</p>
        <p>mobileNumber:${mobileNumber}</p>
        <p>alternateNumber:${alternateNumber}</p>
        <p>adharNumber:${adharNumber}</p>
        <p>panNumber:${panNumber}</p>
        <p>password:${password}</p>
        <p>address:${address}</p>
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
    return res.send({ status: true, message: "Franchise registered successfully" });
  } catch (error) {
    return res.send({ status: false, message: "Something went wrong. Send data properly." })
  }
}

export const loginFranchise = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.send({ status: false, message: "identifier and password are required" });
    }

    // identifier can be adharNumber, panNumber, or email
    const franchise = await franchiseModel.findOne({
      $or: [
        { adharNumber: identifier },
        { panNumber: identifier },
        { email: identifier },
        { mobileNumber: identifier }
      ]
    });

    if (password != franchise.password) {
      return res.send({ status: false, message: "Invalid password" })
    }

    if (!franchise) {
      return res.send({ status: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: franchise._id },
      envCredentials.secretKey,
      { expiresIn: "4h" }
    );

    return res.send({ status: true, message: "Login successful", data: franchise, token: token });
  } catch (error) {
    return res.send({ status: false, message: "Server Error" })
  }
};

export const getOtpForFranchise = async (req, res) => {
  const { id } = req.body;
  if (!id) return res.send({ status: false, message: "ID required" });

  const franchise = await franchiseModel.findById(id);
  if (!franchise) return res.send({ status: false, message: "Franchise not found." });

  const otp = Math.floor(100000 + Math.random() * 900000);
  await otpModel.create({ id, otp });

  await sendMail({
    to: franchise.email,
    subject: "OTP for Franchise Password Reset",
    text: "Your OTP Code for Verification",
    html: `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
      <p class="greeting">Hello Franchise Partner,</p>
      <p class="description">
        A one-time password (OTP) has been generated for your ManoMilan franchise account. Use the code below to reset your password.
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
        <strong>Security Notice:</strong> Never share this code with anyone. If you didn't request this code, please contact ${franchise.email}.
      </div>
    </div>
  </div>
</body>
</html>
    `
  });


  return res.send({ status: true, message: "OTP sent to email." });
};

export const verifyOtpAndChangeFranchisePassword = async (req, res) => {
  try {
    const { id, otp, newPassword } = req.body;
    if (!id || !otp || !newPassword)
      return res.send({ status: false, message: "All fields required." });

    const otpEntry = await otpModel.findOne({ id }).sort({ createdAt: -1 });
    if (!otpEntry) return res.send({ status: false, message: "OTP not found or expired." });

    const isExpired = new Date() - new Date(otpEntry.createdAt) > 10 * 60 * 1000;
    if (isExpired) return res.send({ status: false, message: "OTP expired." });

    if (parseInt(otp) !== otpEntry.otp)
      return res.send({ status: false, message: "Incorrect OTP." });

    const hashedPassword = await bcrypt.hash(newPassword.toString(), 10);
    await franchiseModel.findByIdAndUpdate(id, { password: hashedPassword });
    await otpModel.deleteMany({ id });

    return res.send({ status: true, message: "Password updated successfully." });
  } catch (error) {
    return res.send({ status: false, message: "Server error" })
  }
};

export const updateFranchiseProfile = async (req, res) => {
  const { franchiseId } = req.id;
  const updateData = req.body;

  if (!franchiseId) {
    return res.send({ status: false, message: "Franchise ID is required" });
  }

  if (!updateData) {
    return res.send({ status: false, message: "Please send update data" })
  }

  try {
    const existingFranchise = await franchiseModel.findById(franchiseId);

    if (!existingFranchise) {
      return res.send({ status: false, message: "Franchise not found" });
    }

    // Handle file uploads
    if (req.files?.franchisePhoto?.[0]) {
      updateData.franchisePhoto = req.files.franchisePhoto[0].filename;
    }

    if (req.files?.qrPhoto?.[0]) {
      updateData.qrPhoto = req.files.qrPhoto[0].filename;
    }

    const updatedFranchise = await franchiseModel.findByIdAndUpdate(
      franchiseId,
      updateData,
      { new: true }
    );

    return res.send({ status: true, message: "Profile updated successfully", data: updatedFranchise });

  } catch (error) {
    return res.status(500).send({ status: false, message: "Something went wrong", error: error.message });
  }
};

export const createMember = async (req, res) => {
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
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: "Server Error",
    });
  }
};

export const viewMember = async (req, res) => {
  try {
    const franchiseId = req.id;
    const currentFranchise = await franchiseModel.findById(franchiseId);

    const lowerLimit = parseInt(req.query.lowerLimit) || 0;  // start from 0
    const upperLimit = parseInt(req.query.upperLimit) || 10; // number of results

    const allUsers = await userModel
      .find({ CreatedBy: currentFranchise.franchiseName }, '-_id -__v -franchiseUnder -createdBy -password')
      .skip(lowerLimit)
      .limit(upperLimit);

    return res.send({ status: true, result: allUsers });

  } catch (error) {
    console.error(error);
    return res.send({ status: false, message: "Server Error" });
  }
}

export const getSingleUser = async (req, res) => {
  try {
    const franchiseId = req.id;
    const { userId } = req.params;
    if (!userId) {
      return res.send({ status: false, message: "User Id not found" })
    }
    const franchise = await franchiseModel.findById(franchiseId);
    const user = await userModel.findById(userId);
    const isUnderFranchise = user?.franchiseUnder === franchise.franchiseName ? true : false;
    if (!isUnderFranchise) {
      return res.send({ status: false, message: 'Sorry this user is not under your frachise. Contact admin.' });
    }
    return res.send({ status: true, user })
  } catch (error) {
    return res.send({ status: false, message: "Server error" })
  }
}

export const InactivateUser = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.send({ status: false, message: "User id required" })
    }
    const user = await userModel.findById(userId);
    user.ActiveStatus = false;
    await user.save()
    return res.send({ status: true, message: "User inactivated successfully." })
  } catch (error) {
    return res.send({ status: false, message: 'Server error' })
  }
}

// Reports 
export const getReportsFranchise = async (req, res) => {
  try {
    const franchiseId = req.id; // franchise JWT id
    const { filters = {}, fields = [] } = req.body;

    const currentFranchise = await franchiseModel.findById(franchiseId);
    if (!currentFranchise) {
      return res.status(403).json({ success: false, message: "Invalid franchise" });
    }

    let query = {
      CreatedBy: currentFranchise.franchiseName // 🔒 HARD SCOPE SECURITY
    };

    // SAME FILTER LOGIC AS ADMIN & DISTRIBUTOR
    if (filters.nativeCountry) query["nativeCity.country"] = filters.nativeCountry;
    if (filters.nativeState) query["nativeCity.state"] = filters.nativeState;
    if (filters.nativeCity) query["nativeCity.city"] = filters.nativeCity;

    if (filters.workCountry) query["workLocation.country"] = filters.workCountry;
    if (filters.workState) query["workLocation.state"] = filters.workState;
    if (filters.workCity) query["workLocation.city"] = filters.workCity;

    if (filters.religion) query["caste.religion"] = filters.religion;
    if (filters.caste) query["caste.caste"] = filters.caste;
    if (filters.subCaste) query["caste.subCaste"] = filters.subCaste;
    if (filters.motherTongue) query["motherTongue"] = filters.motherTongue;

    if (filters.education) {
      query["education"] = Array.isArray(filters.education)
        ? { $in: filters.education }
        : filters.education;
    }
    if (filters.occupation) query["occupation"] = filters.occupation;
    if (filters.monthlyIncome) {
      const income = Number(filters.monthlyIncome);
      if (!isNaN(income)) query["monthlyIncome"] = { $gte: income };
    }

    if (filters.maritalStatus) query["maritalStatus"] = filters.maritalStatus;
    if (filters.divyang) query["divyang"] = filters.divyang;

    // MANDATORY OUTPUT FIELDS
    const mandatoryFields = [
      "_id",
      "UserId",
      "firstName",
      "lastName",
      "loginEmail",
      "userPhotoStatus",
      "loginNumber",
      "whatsApp",
      "createdAt",
      "updatedAt",
      "ActiveStatus"
    ];

    let projection = {};
    [...new Set([...mandatoryFields, ...fields])].forEach(field => {
      if (field !== "password") projection[field] = 1;
    });

    // FETCH DATA
    const users = await userModel.find(query, projection);
    const sanitizedUsers = users.map(u => {
      const obj = u.toObject();
      delete obj.password;
      return obj;
    });

    res.status(200).json({
      success: true,
      count: sanitizedUsers.length,
      data: sanitizedUsers
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error. Check request.",
      error: error.message
    });
  }
};

// === MESSAGES === 

export const getDistributorAndAdmin = async (req, res) => {
  const franchiseId = req.id;
  const franchise = await franchiseModel.findById(franchiseId);

  const users = await userModel.find({ franchiseUnder: franchise.franchiseName })
  const distributor = await distributorModel.find({ distributorName: franchise.distributorUnder })
  const admin = await adminModel.find({}, '-points -transactionPassword -givePointsPassword -password -__v -createdAt -updatedAt')

  return res.send({ status: true, distributor, admin, users })
}

export const sendMessageFromFranchise = async (req, res) => {
  try {
    const getUserNameById = async (id) => {
      let user = await adminModel.findById(id) || await distributorModel.findById(id) || await franchiseModel.findById(id) || await userModel.findById(id);
      return user
        ? user.firstName
          ? `${user.firstName} ${user.midname} ${user.lastName}`
          : user.franchiseName || user.distributorName || user.name
        : 'Unknown';
    };

    const senderId = req.id;
    const { receiverIds, message } = req.body;

    if (!message) return res.send({ status: false, message: "Message content is missing" });
    if (!receiverIds || receiverIds.length === 0) return res.send({ status: false, message: "Receiver IDs are missing" });

    const franchise = await franchiseModel.findById(senderId);
    if (!franchise) return res.send({ status: false, message: "Franchise not found" });

    const to = await Promise.all(receiverIds.map(id => getUserNameById(id)));

    const newMessage = new MessageModel({
      senderId,
      receiverId: receiverIds,
      from: franchise.franchiseName || 'Franchise User',
      to,
      message,
      status: 'sent'
    });

    await newMessage.save();
    return res.send({ status: true, message: "Message sent successfully" });
  } catch (error) {
    return res.send({ status: false, message: "Error sending message", error });
  }
};

export const draftMessageFromFranchise = async (req, res) => {
  try {
    const getUserNameById = async (id) => {
      let user = await adminModel.findById(id) || await distributorModel.findById(id) || await franchiseModel.findById(id) || await userModel.findById(id);
      return user
        ? user.firstName
          ? `${user.firstName} ${user.midname} ${user.lastName}`
          : user.franchiseName || user.distributorName || user.name
        : 'Unknown';
    };

    const senderId = req.id;
    const { receiverIds, message } = req.body;

    if (!message) return res.send({ status: false, message: "Message content is missing" });
    if (!receiverIds || receiverIds.length === 0) return res.send({ status: false, message: "Receiver IDs are missing" });

    const franchise = await franchiseModel.findById(senderId);
    if (!franchise) return res.send({ status: false, message: "Franchise not found" });

    const to = await Promise.all(receiverIds.map(id => getUserNameById(id)));

    const draftMessage = new MessageModel({
      senderId,
      receiverId: receiverIds,
      from: franchise.franchiseName || 'Franchise User',
      to,
      message,
      status: 'drafted'
    });

    await draftMessage.save();
    return res.send({ status: true, message: "Message drafted successfully" });
  } catch (error) {
    return res.send({ status: false, message: "Error drafting message", error });
  }
};

export const getSentMessagesForFranchise = async (req, res) => {
  try {
    const senderId = req.id;

    const messages = await MessageModel.find({
      senderId,
      status: 'sent'
    }).sort({ createdAt: -1 });

    return res.send({ status: true, data: messages });
  } catch (error) {
    return res.send({ status: false, message: "Error fetching sent messages", error });
  }
};

export const getDraftedMessagesForFranchise = async (req, res) => {
  try {
    const senderId = req.id;

    const drafts = await MessageModel.find({
      senderId,
      status: 'drafted'
    }).sort({ updatedAt: -1 });

    return res.send({ status: true, data: drafts });
  } catch (error) {
    return res.send({ status: false, message: "Error fetching drafted messages", error });
  }
};

export const getRepliesForFranchise = async (req, res) => {
  try {
    const userId = req.id;

    const replies = await MessageModel.find({
      receiverId: userId,
      status: 'sent'
    }).sort({ createdAt: -1 });

    return res.send({ status: true, data: replies });
  } catch (error) {
    return res.send({ status: false, message: "Error fetching replies", error });
  }
};

export const getCurrentFranchise = async (req, res) => {
  try {
    const franchiseId = req.id
    const franchise = await franchiseModel.findById(franchiseId);
    return res.send({ status: true, franchise })
  } catch (error) {
    return res.send({ status: false, message: "Server error" })
  }
}

// === ALLOT PACKAGE ===
export const getPackages = async (req, res) => {
  try {
    const { franchiseId } = req.params;
    if (!franchiseId) {
      return res.send({ status: false, message: "franchiseId required" })
    }
    const franchisePackages = await franchisePackageModel
      .find({ franchiseId })
      .populate('mainPackageId')
      .populate('vipPackage')
      .populate('addOnPackage');
    if (franchisePackages.length === 0) {
      return res.send({ status: false, message: "No packages alloted" })
    }
    return res.send({ status: true, franchisePackages })
  } catch (error) {
    return res.send({ status: false, message: "Server error" })
  }
}

export const allotMainAddOnPackage = async (req, res) => {
  try {
    const { userId, franchisePackageId } = req.body;

    if (!userId || !franchisePackageId) {
      return res.send({ status: false, message: "userId, franchisePackageId required" });
    }

    const packageDetails = await franchisePackageModel.findById(franchisePackageId)
      .populate(['mainPackageId', 'vipPackage', 'addOnPackage']);

    if (parseInt(packageDetails.mainPackageId?.memberCost || packageDetails.addOnPackage?.memberCost) > parseInt(franchise.points)) {
      return res.send({ status: false, message: "Insufficient points balance. Purchase new points." })
    }
    if (!packageDetails) {
      return res.send({ status: false, message: "Franchise Package not found" });
    }

    const mainPackage = packageDetails.mainPackageId;
    if (!mainPackage || mainPackage.adminShare == null || mainPackage.memberCost == null) {
      return res.send({ status: false, message: "Main package details missing or incomplete" });
    }

    const franchiseShare = parseInt(packageDetails.franchiseShare);
    const distributorShare = parseInt(packageDetails.distributorShare);
    const adminShare = parseInt(mainPackage.adminShare);
    const memberCost = parseInt(mainPackage.memberCost);

    const user = await userModel.findById(userId);
    if (!user) {
      return res.send({ status: false, message: "User not found" });
    }

    const distributor = await distributorModel.findById(packageDetails.distributorId);
    if (!distributor) {
      return res.send({ status: false, message: "Distributor not found" });
    }

    distributor.points = parseInt(distributor.points) + distributorShare;
    await distributor.save();

    const newDistributorLog = new distributorpointslogModel({
      distributorId: distributor._id,
      points: distributorShare,
      Type: 'Credited',
      By: user.loginEmail,
      Balance: distributor.points
    });
    await newDistributorLog.save();

    const franchise = await franchiseModel.findById(packageDetails.franchiseId);
    if (!franchise) {
      return res.send({ status: false, message: "Franchise not found" });
    }

    franchise.points = parseInt(franchise.points) - (distributorShare + adminShare);
    await franchise.save();

    const newFranchisePointsLog = new franchisePointsLogModel({
      franchiseId: franchise._id,
      points: -(distributorShare + adminShare),
      Type: 'Debited',
      By: userId,
      Balance: franchise.points
    });
    await newFranchisePointsLog.save();

    const newUserPackage = new userPackageTrackModel({
      userId,
      franchisePackage: packageDetails._id,
    });
    await newUserPackage.save();

    user.numberOfAddresses = parseInt(user.numberOfAddresses || 0) + parseInt(newUserPackage.assignedAddresses || 0);
    user.validity = new Date(Date.now() + (newUserPackage.validity || 0) * 24 * 60 * 60 * 1000);
    await user.save();

    return res.send({
      status: true,
      message: "Main/AddOn Package allotted",
      packageDetails,
      newFranchisePointsLog,
      newDistributorLog
    });

  } catch (error) {
    console.error("Error in allotMainAddOnPackage:", error);
    return res.send({ status: false, message: "Server error", error: error.message });
  }
};

export const allotVipPackage = async (req, res) => {
  try {
    const { userId, franchisePackageId } = req.body;

    if (!userId || !franchisePackageId) {
      return res.send({ status: false, message: "userId, franchisePackageId required" });
    }

    const packageDetails = await franchisePackageModel.findById(franchisePackageId)
      .populate(['mainPackageId', 'vipPackage', 'addOnPackage']);

    if (!packageDetails) {
      return res.send({ status: false, message: "Franchise Package not found" });
    }

    if (parseInt(packageDetails.vipPackage?.memberCost) > parseInt(franchise.points)) {
      return res.send({ status: false, message: "Insufficient points balance. Purchase new points." })
    }

    const vipPackage = packageDetails.vipPackage;
    if (!vipPackage || vipPackage.adminShare == null || vipPackage.memberCost == null) {
      return res.send({ status: false, message: "VIP package details missing or incomplete" });
    }

    const franchiseShare = parseInt(packageDetails.franchiseShare);
    const distributorShare = parseInt(packageDetails.distributorShare);
    const adminShare = parseInt(vipPackage.adminShare);
    const memberCost = parseInt(vipPackage.memberCost);

    const user = await userModel.findById(userId);
    if (!user) {
      return res.send({ status: false, message: "User not found" });
    }

    if (!user.vipMember) {
      return res.send({ status: false, message: "User is not a VIP member." });
    }

    const distributor = await distributorModel.findById(packageDetails.distributorId);
    if (!distributor) {
      return res.send({ status: false, message: "Distributor not found" });
    }

    distributor.points = parseInt(distributor.points) + distributorShare;
    await distributor.save();

    const newDistributorLog = new distributorpointslogModel({
      distributorId: distributor._id,
      points: distributorShare,
      Type: 'Credited',
      By: user.loginEmail,
      Balance: distributor.points
    });
    await newDistributorLog.save();

    const franchise = await franchiseModel.findById(packageDetails.franchiseId);
    if (!franchise) {
      return res.send({ status: false, message: "Franchise not found" });
    }

    franchise.points = parseInt(franchise.points) - (distributorShare + adminShare);
    await franchise.save();

    const newFranchisePointsLog = new franchisePointsLogModel({
      franchiseId: franchise._id,
      points: -(distributorShare + adminShare),
      Type: 'Debited',
      By: userId,
      Balance: franchise.points
    });
    await newFranchisePointsLog.save();

    const newUserPackage = new userPackageTrackModel({
      userId,
      franchisePackage: packageDetails._id,
    });
    await newUserPackage.save();

    user.numberOfAddresses = parseInt(user.numberOfAddresses || 0) + parseInt(newUserPackage.assignedAddresses || 0);
    user.validity = new Date(Date.now() + (newUserPackage.validity || 0) * 24 * 60 * 60 * 1000);
    await user.save();

    return res.send({
      status: true,
      message: "VIP Package allotted",
      packageDetails,
      newFranchisePointsLog,
      newDistributorLog
    });

  } catch (error) {
    console.error("Error in allotVipPackage:", error);
    return res.send({ status: false, message: "Server error", error: error.message });
  }
};

// === OFFICE INFO ===
export const updateOfficeInformation = async (req, res) => {
  try {
    const {
      userId,
      Complexion,
      BodyType,
      familyBackground,
      features,
      officeHeight,
      position,
      vipMember,
      Reference,
      ReferenceMobile,
    } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update basic fields
    user.Complexion = Complexion || user.Complexion;
    user.BodyType = BodyType || user.BodyType;
    user.familyBackground = familyBackground || user.familyBackground;
    user.features = features || user.features;
    user.officeHeight = officeHeight || user.officeHeight;
    user.position = position || user.position;
    user.vipMember = vipMember === 'true' || vipMember === true;
    user.Reference = Reference || user.Reference;
    user.ReferenceMobile = ReferenceMobile || user.ReferenceMobile;

    // Handle uploaded files (Multer adds req.files)
    user.userPhotoFive = req?.files?.userPhotoFive?.[0]?.filename || "";
    user.userPhotoSix = req?.files?.userPhotoSix?.[0]?.filename || "";


    await user.save();

    res.status(200).json({
      message: "Office information updated successfully",
      data: user
    });

  } catch (error) {
    console.error("Error in updateOfficeInformation:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
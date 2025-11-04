import distributorModel from "../models/distributor.model.js";
import jwt from "jsonwebtoken"
import envCredentials from "../config/env.js";
import userModel from "../models/user.model.js";
import franchiseModel from "../models/franchise.model.js";
import adminModel from "../models/admin.model.js";
import MessageModel from "../models/small_models/Message.model.js";
import franchisePointsLogModel from "../models/small_models/franchisePointsLog.model.js";
import bcrypt from 'bcrypt'
import distributorpointslogModel from "../models/small_models/distributorpointslog.model.js";
import franchisePackageModel from "../models/small_models/franchise.package.model.js";
import mainPackageModel from "../models/small_models/mainPackage.model.js";
import vipPackageModel from "../models/small_models/vipPackage.model.js";
import sendMail from "../utils/mail.js";
import otpModel from "../models/small_models/otp.model.js";

export const registerDistributor = async (req, res) => {
    const {
        distributorName,
        ownerName,
        mobileNumber,
        alternateNumber,
        adharNumber,
        panNumber,
        password,
        email,
        address,
        location,
        socialMedia,
        pincode,
        transactionPassword
    } = req.body;

    const ExistingDistributor = await distributorModel.findOne({
        $or: [
            { distributorName },
            { mobileNumber },
            { adharNumber },
            { panNumber },
            { email }
        ]
    });
    if (ExistingDistributor) {
        return res.send({ status: false, messsage: "Distributor already exists with this details." })
    }

    let qrPhoto;
    let distributorPhoto;


    try {
        if (req.files?.qrPhoto || req.files?.qrPhoto?.length !== 0) {
            qrPhoto = req.files.qrPhoto[0].filename;
        }
    } catch (error) {
        qrPhoto = ''
    }

    try {
        if (req.files?.distributorPhoto || req.files?.distributorPhoto?.length !== 0) {
            distributorPhoto = req.files.distributorPhoto[0].filename
        }
    } catch (error) {
        distributorPhoto = ''
    }

    // try {
    const newDistributor = new distributorModel({
        distributorName,
        ownerName,
        mobileNumber,
        alternateNumber,
        adharNumber,
        panNumber,
        password,
        email,
        address,
        location,
        distributorPhoto,
        qrPhoto,
        socialMedia,
        pincode,
        transactionPassword
    })
    const distributor = await newDistributor.save();

    await sendMail({
        to: email,
        subject: `New Distributor Registered – ${distributorName}`,
        text: `A new distributor has been registered.\n\nName: ${distributorName}\nOwner: ${ownerName}\nEmail: ${email}\nPassword: ${password}`,
        html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>New Distributor Registered</title>
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
      <h1>New Distributor Registered</h1>
    </div>
    <div class="content">
      <p>A new distributor has registered for manomilan.</p>
      <div class="info-box">
        <p><strong>Distributor Name:</strong> ${distributorName}</p>
        <p><strong>Owner Name:</strong> ${ownerName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mobile:</strong> ${mobileNumber}</p>
        <p><strong>Alternate Number:</strong> ${alternateNumber}</p>
        <p><strong>Password:</strong> ${password}</p>
        <p><strong>Transaction password:</strong> ${transactionPassword}</p>
      </div>
      <p>Please initiate onboarding as per the operational protocol.</p>
    </div>
    <div class="footer">
      &copy; 2025 ManoMilan Distributor Portal
    </div>
  </div>
</body>
</html>
`
    });

    return res.send({ status: true, message: "Distributor registered successfully", distributor })
    // } catch (error) {
    //     return res.send({ status: false, message: "Something went wrong. Send details properly." })
    // }
}

export const loginDistributor = async (req, res) => {
    try {
        const { identifier, password } = req.body;
        let distributor = await distributorModel.findOne({ email: identifier });
        if (!distributor) {
            distributor = await distributorModel.findOne({ mobileNumber: identifier })
        }

        if (!distributor) {
            return res.status(401).json({ status: false, message: "Invalid mobile number or email" });
        }

        // Compare passwords
        if (password != distributor.password) {
            return res.status(401).json({ status: false, message: "Invalid password" });
        }

        // Create JWT token
        const token = jwt.sign(
            { id: distributor._id },
            envCredentials.secretKey,
            { expiresIn: "4h" }
        );

        const franchisesUnder = await franchiseModel.find({ distributorUnder: distributor.distributorName });

        const franchiseNames = franchisesUnder.map((ele) => {
            return ele.franchiseName
        })

        const users = await userModel.find({ franchiseUnder: { $in: franchiseNames } })

        return res.json({
            status: true,
            message: "Login successful",
            token,
            distributor,
            accountBalance: distributor.points,
            franchisesUnder: franchisesUnder.length,
            users
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, message: "Server error" });
    }
};

export const changeTransactionPassword = async (req, res) => {
    try {
        const { transactionPassword, newTransactionPassword, id } = req.body;

        if (!transactionPassword || !newTransactionPassword || !id) {
            return res.send({ status: false, message: "id, transactionPassword and newTransactionPassword required" });
        }

        const distributor = await distributorModel.findById(id);
        if (!distributor) {
            return res.send({ status: false, message: "Distributor not found" });
        }

        const isMatch = await bcrypt.compare(transactionPassword, distributor.transactionPassword);
        if (!isMatch) {
            return res.send({ status: false, message: "Transaction password didn't match" });
        }

        distributor.transactionPassword = await bcrypt.hash(newTransactionPassword, 10);
        await distributor.save();

        return res.send({ status: true, message: 'New transaction password set successfully.' });
    } catch (error) {
        return res.send({ status: false, message: "Server error" });
    }
};

export const editProfileDistributor = async (req, res) => {
    try {
        const distributorId = req.id;
        const { updateData } = req.body;
        const distributor = await distributorModel.findByIdAndUpdate(distributorId, updateData, { new: true });
        if (!distributor) {
            return res.send({ status: false, message: "Distributor not found." });
        }
        return res.send({ status: true, message: "Profile updated successfully.", distributor });
    } catch (error) {
        return res.send({ status: false, message: "Server error" });
    }
};


export const getOtpForDistributor = async (req, res) => {
    const { id } = req.body;
    if (!id) return res.send({ status: false, message: "ID required" });

    const distributor = await distributorModel.findById(id);
    if (!distributor) return res.send({ status: false, message: "Distributor not found." });

    const otp = Math.floor(100000 + Math.random() * 900000);
    await otpModel.create({ id, otp });

    await sendMail({
        to: distributor.email,
        subject: "OTP for ManoMilan Distributor Password Reset",
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
            <p class="greeting">Hello Distributor,</p>
            <p class="description">
                We’ve generated a secure one-time password for your ManoMilan distributor account. 
                Please use the code below to reset your password.
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
                <strong>Security Notice:</strong> Never share this code with anyone. If you didn't request this code, please contact ${distributor.email}.
            </div>
        </div>
    </div>
</body>
</html>
    `
    });


    return res.send({ status: true, message: "OTP sent to email." });
};

export const inactivateFranchise = async (req, res) => {
    try {
        const { franchiseId } = req.body;
        if (!franchiseId) {
            return res.send({ status: false, message: "Franchise Id not found" });
        }

        const franchise = await franchiseModel.findById(franchiseId);
        if (!franchise) {
            return res.send({ status: false, message: "Wrong ID — franchise not found." });
        }

        franchise.Status = "inactive";
        await franchise.save();

        return res.send({ status: true, message: "Franchise inactivated successfully." });
    } catch (error) {
        console.error("Error inactivateFranchise:", error);
        return res.status(500).send({ status: false, message: "Internal server error." });
    }
};

// VERIFY OTP AND CHANGE PASSWORD
export const verifyOtpAndChangeDistributorPassword = async (req, res) => {
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
        await distributorModel.findByIdAndUpdate(id, { password: hashedPassword });
        await otpModel.deleteMany({ id });

        return res.send({ status: true, message: "Password updated successfully." });
    } catch (error) {
        return res.send({ status: false, message: "Server error" })
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const distributorId = req.id;
        const { lowerLimit } = parseInt(req.body.lowerLimit) || 0;
        const { upperLimit } = parseInt(req.body.upperLimit) || 10;

        const currentDistributor = await distributorModel.findById(distributorId)
        const franchisesUnder = await franchiseModel.find({ distributorUnder: currentDistributor.distributorName });

        if (franchisesUnder.length === 0) {
            return res.send({ status: false, message: 'No franchises found under you.Kindly create or register new franchise.' })
        }

        const franchisesNameArr = franchisesUnder.map((ele) => {
            return ele.franchiseName
        });

        const users = await userModel.find({ franchiseUnder: { $in: franchisesNameArr } }).skip(lowerLimit).limit(upperLimit)

        // console.log(franchisesNameArr)

        if (users.length == 0) {
            return res.send({ status: true, franchisesUnder, users: "No users found" });
        }

        return res.send({ status: true, users })

    } catch (error) {
        return res.send({ status: false, message: "Something went wrong. Internal server error" })
    }

}

export const getCurrentDistributor = async (req, res) => {
    try {
        const { distributorId } = req.body;
        const distributor = await distributorModel.findById(distributorId);
        if (!distributor) {
            return res.send({ status: false, message: "Distributor not found." })
        }
        return res.send({ status: true, distributor })
    } catch (error) {
        return res.send({ status: false, message: "Server error" })
    }

}

export const getSingleFranchise = async (req, res) => {
    try {
        const { franchiseId } = req.body;
        if (!franchiseId) {
            return res.send({ status: false, message: 'Franchise ID not found' })
        }
        const franchise = await franchiseModel.findById(franchiseId);
        return res.send({ status: true, franchise })
    } catch (error) {
        return res.send({ status: false, message: "Server error" })
    }
}

export const getSingleUser = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.send({ status: false, message: "User Id required" })
        }
        const user = await userModel.findById(userId);
        if (!user) {
            return res.send({ status: false, message: "User not found check Id properly." })
        }
        return res.send({ status: true, user })
    } catch (error) {
        return res.send({ status: false, message: "Server error" })
    }
}

// REPORTS 
export const getReportsDistributor = async (req, res) => {
    try {
        const distributorId = req.id;
        const { filters = {}, fields = [] } = req.body;
        let query = {};

        // First, LIMIT visibility
        const currentDistributor = await distributorModel.findById(distributorId);
        const franchisesUnder = await franchiseModel.find({
            distributorUnder: currentDistributor.distributorName
        });

        if (franchisesUnder.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No franchises found under you. Kindly create/register a franchise."
            });
        }

        const allowedFranchises = franchisesUnder.map(f => f.franchiseName);
        query["franchiseUnder"] = { $in: allowedFranchises }; // ENFORCED SCOPE ✅

        // SAME FILTER LOGIC AS ADMIN
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

        // 🚨 distributor / franchise filters ARE IGNORED FROM BODY
        // distributor CANNOT override scope manually

        // Mandatory fields (shared with admin API)
        const mandatoryFields = [
            "_id",
            "UserId",
            "firstName",
            "lastName",
            "loginEmail",
            "franchiseUnder",
            "userPhotoStatus",
            "loginNumber",
            "whatsApp",
            "createdAt",
            "updatedAt",
            "ActiveStatus"
        ];

        let projection = {};
        [...new Set([...mandatoryFields, ...fields])].forEach(f => {
            if (f !== "password") projection[f] = 1;
        });

        const users = await userModel.find(query, projection);

        const sanitizedUsers = users.map(user => {
            const obj = user.toObject();
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
            message: "Server Error. Check your request body.",
            error: error.message
        });
    }
};

// === POINTS ===
export const givePointsToFranchise = async (req, res) => {
    try {
        const distributorId = req.id;
        const { franchiseId, Points, transactionPassword } = req.body;

        if (!franchiseId || !Points || !transactionPassword) {
            return res.send({ status: false, message: "Franchise Id, points and transactionPassword required" });
        }
        const distributor = await distributorModel.findById(distributorId);
        if (!(await bcrypt.compare(transactionPassword, distributor.transactionPassword))) {
            return res.send({ status: false, message: "Invalid transaction password" })
        }
        const franchise = await franchiseModel.findById(franchiseId);
        if (!franchise) {
            return res.send({ status: false, message: "Wrong Franchise ID. Franchise not found." })
        }

        if (parseInt(distributor.points) < parseInt(Points)) {
            return res.send({ status: false, message: "You have Insufficient points. Please get more points to allot." })
        }

        distributor.points = parseInt(distributor.points) - parseInt(Points);
        franchise.points = parseInt(franchise.points) + parseInt(Points);

        const newFranchiseLog = await franchisePointsLogModel({
            franchiseId: franchise._id,
            points: Points,
            Type: 'Credited',
            Balance: franchise.points,
            By: distributor.distributorName
        })
        const distributorLog = new distributorpointslogModel({
            distributorId: distributor._id,
            points: -Points,
            Type: 'Debited',
            Balance: distributor.points,
            By: distributor.distributorName
        })
        try {
            await distributor.save();
            await franchise.save();
            await newFranchiseLog.save()
            await distributorLog.save()
            return res.send({ status: true, message: "Points alloted to  franchise." })
        } catch (error) {
            return res.send({ status: false, message: "Points not alloted. Server error." })
        }
    } catch (error) {
        return res.send({ status: false, message: "Server error" })
    }
}

export const getFranchisePointsLog = async (req, res) => {
    try {
        const { franchiseId } = req.params;
        if (!franchiseId) {
            return res.send({ status: false, message: 'franchise Id not found' })
        }
        const franchise = await franchiseModel.findById(franchiseId);
        if (!franchise) {
            return res.send({ status: false, message: "Wrong Id franchise not found." })
        }
        const franchiseLogs = await franchisePointsLogModel.find({
            franchiseId
        }).sort({ createdAt: -1 })
        if (franchiseLogs.length === 0) {
            return res.send({ status: false, message: "No logs found for this franchise" })
        }
        return res.send({ status: true, franchiseLogs })
    } catch (error) {
        return res.send({ status: false, message: "Server error" })
    }
}

// === MESSAGES ===
export const getFranchisesAndAdmin = async (req, res) => {
    try {
        const distributorId = req.id;
        const currentDistributor = await distributorModel.findById(distributorId)
        const franchises = await franchiseModel.find({ distributorUnder: currentDistributor.distributorName });
        const admin = await adminModel.find({}, '-points -transactionPassword -givePointsPassword -password -__v -createdAt -updatedAt')
        return res.send({ status: true, franchises, admin })
    } catch (error) {
        return res.send({ status: false, message: "Server error" })
    }
}

export const getUsers = async (req, res) => {
    try {
        const franchiseName = req.query.franchiseName;
        const franchise = await franchiseModel.findOne({ franchiseName: franchiseName });

        const lowerLimit = parseInt(req.query.lowerLimit) || 0;  // start from 0
        const upperLimit = parseInt(req.query.upperLimit) || 10; // number of results

        const allUsers = await userModel
            .find({ franchiseUnder: franchise.franchiseName })
            .skip(lowerLimit)
            .limit(upperLimit);

        return res.send({ status: true, result: allUsers });

    } catch (error) {
        return res.send({ status: false, message: "Server error" })
    }
}

export const sendMessageFromDistributor = async (req, res) => {
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

        const distributor = await distributorModel.findById(senderId);
        if (!distributor) return res.send({ status: false, message: "Distributor not found" });

        const to = await Promise.all(receiverIds.map(id => getUserNameById(id)));

        const newMessage = new MessageModel({
            senderId,
            receiverId: receiverIds,
            from: distributor.distributorName || 'Distributor User',
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

export const draftMessageFromDistributor = async (req, res) => {
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

        const distributor = await distributorModel.findById(senderId);
        if (!distributor) return res.send({ status: false, message: "Distributor not found" });

        const to = await Promise.all(receiverIds.map(id => getUserNameById(id)));

        const draftMessage = new MessageModel({
            senderId,
            receiverId: receiverIds,
            from: distributor.distributorName || 'Distributor User',
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

export const getSentMessagesForDistributor = async (req, res) => {
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

export const getDraftedMessagesForDistributor = async (req, res) => {
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

export const getRepliesForDistributor = async (req, res) => {
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

export const deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.body;
        if (!messageId) {
            return res.send({ status: false, message: "Message ID required" });
        }
        await MessageModel.findByIdAndDelete(messageId);
        return res.send({ status: true, message: "Message deleted successfully" });
    } catch (error) {
        return res.send({ status: false, message: "Error deleting message", error });
    }
};

// === PACKAGES ===
export const givePackageToFranchise = async (req, res) => {
    try {
        const distributorId = req.id;
        const { packageId, franchiseId, franchiseShare } = req.body;
        if (!packageId || !franchiseId || !franchiseShare) {
            return res.send({ status: false, message: "packageId, franchiseId  and franchiseShare required" })
        }

        const mainPackage = await mainPackageModel.findById(packageId) || null;
        const vipPackage = await vipPackageModel.findById(packageId) || null;
        if (!mainPackage && !vipPackage) {
            return res.send({ status: false, message: "Package not found" })
        }

        let newFranchisePackage;
        if (mainPackage) {
            if (mainPackage.memberCost - mainPackage.adminShare < franchiseShare) {
                return res.send({ status: false, message: "Invalid franchise share" })
            }
            newFranchisePackage = new franchisePackageModel({
                mainPackageId: mainPackage._id,
                franchiseId,
                franchiseShare,
                distributorId,
                distributorShare: parseInt(mainPackage.memberCost) - parseInt(mainPackage.adminShare) - parseInt(franchiseShare)
            })
        }
        if (vipPackage) {
            if (vipPackage.memberCost - vipPackage.adminShare < franchiseShare) {
                return res.send({ status: false, message: "Invalid franchise share" })
            }
            newFranchisePackage = new franchisePackageModel({
                vipPackage: vipPackage._id,
                franchiseId,
                franchiseShare,
                distributorId,
                distributorShare: parseInt(vipPackage.memberCost) - parseInt(vipPackage.adminShare) - parseInt(franchiseShare)
            })
        }
        await newFranchisePackage.save();
        return res.send({ status: true, message: "Package alloted to franchise", newFranchisePackage })
    } catch (error) {
        return res.send({ status: false, message: "Server error" })
    }
}

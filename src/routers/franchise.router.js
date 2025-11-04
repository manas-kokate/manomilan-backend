import express from "express"
import { uploadMiddleware } from "../utils/upload.js";
import {
    registerFranchise, loginFranchise, updateFranchiseProfile, createMember, viewMember,
    sendMessageFromFranchise,
    getSentMessagesForFranchise,
    draftMessageFromFranchise,
    getDraftedMessagesForFranchise,
    getRepliesForFranchise,
    getDistributorAndAdmin,
    getSingleUser,
    getPackages,
    allotMainAddOnPackage,
    getCurrentFranchise,
    allotVipPackage,
    updateOfficeInformation,
    getOtpForFranchise,
    verifyOtpAndChangeFranchisePassword,
    InactivateUser,
    getReportsFranchise
} from "../controllers/franchise.controller.js";
import { distributorAuth, franchiseAuth } from "../middlewares/auth.js";
import { deleteMessage, getFranchisePointsLog } from "../controllers/distributor.controller.js";
import { getCurrentUser } from "../controllers/user.controller.js";
import { getAllPackages } from "../controllers/admin.controller.js";


const router = express.Router();

router.post('/register', uploadMiddleware, distributorAuth, registerFranchise)
router.post('/login', loginFranchise);
router.post('/get-otp', getOtpForFranchise);
router.post('/verify-otp-reset-password', verifyOtpAndChangeFranchisePassword);


router.put('/update/:franchiseId', uploadMiddleware, updateFranchiseProfile);
router.post('/create-member', uploadMiddleware, createMember);
router.get('/view-members', franchiseAuth, viewMember);
router.get('/get-single-user/:userId', franchiseAuth, getSingleUser);
router.get('/getCurrentUser/:userId', getCurrentUser)
router.post('/inactivate-user', InactivateUser)

// Reports
router.post("/reports", getReportsFranchise);

// === OFFICE INFO ===
router.put('/update-user-profile', uploadMiddleware, updateOfficeInformation)

// === MESSAGES ===
router.get('/get-distributor-admin', franchiseAuth, getDistributorAndAdmin)

router.post('/message/send', franchiseAuth, sendMessageFromFranchise)
router.get('/message/get-sendMessages', franchiseAuth, getSentMessagesForFranchise)

router.post('/message/draft', franchiseAuth, draftMessageFromFranchise)
router.get('/message/get-draftedMessages', franchiseAuth, getDraftedMessagesForFranchise);

router.get('/message/replies', franchiseAuth, getRepliesForFranchise);
router.get('/get-current-franchise', franchiseAuth, getCurrentFranchise)

router.delete('/delete-message', deleteMessage);

// === PACKAGES ===
router.get('/get-packages/:franchiseId', getPackages)
router.post('/allot-main-addOnpackage', allotMainAddOnPackage)
router.post('/allot-vip-package', allotVipPackage)
router.get('/get-all-packages', getAllPackages)

// === POINTS ===
router.get('/get/franchiseLogs/:franchiseId', getFranchisePointsLog)
export default router
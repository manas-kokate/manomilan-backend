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
} from "../controllers/franchise.controller.js";
import { distributorAuth, franchiseAuth } from "../middlewares/auth.js";
import { getFranchisePointsLog } from "../controllers/distributor.controller.js";
import { getCurrentUser } from "../controllers/user.controller.js";


const router = express.Router();

router.post('/register', uploadMiddleware, distributorAuth, registerFranchise)
router.post('/login', loginFranchise);
router.put('/update/:franchiseId', uploadMiddleware, updateFranchiseProfile);
router.post('/create-member', franchiseAuth, uploadMiddleware, createMember);
router.get('/view-members', franchiseAuth, viewMember);
router.get('/get-single-user/:userId', franchiseAuth, getSingleUser);
router.get('/getCurrentUser/:userId', getCurrentUser)

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
// === PACKAGES ===
router.get('/get-packages/:franchiseId', getPackages)
router.post('/allot-main-addOnpackage', allotMainAddOnPackage)
router.post('/allot-vip-package', allotVipPackage)

// === POINTS ===
router.get('/get/franchiseLogs/:franchiseId', getFranchisePointsLog)
export default router
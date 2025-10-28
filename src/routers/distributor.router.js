import express from "express";
import {
    loginDistributor, registerDistributor, getAllUsers,
    sendMessageFromDistributor,
    getSentMessagesForDistributor,
    draftMessageFromDistributor,
    getDraftedMessagesForDistributor,
    getRepliesForDistributor,
    getFranchisesAndAdmin,
    getUsers,
    getCurrentDistributor,
    getSingleFranchise,
    givePointsToFranchise,
    getSingleUser,
    getFranchisePointsLog,
    givePackageToFranchise,
    getOtpForDistributor,
    verifyOtpAndChangeDistributorPassword,
    changeTransactionPassword,
    inactivateFranchise,
    getReportsDistributor
} from "../controllers/distributor.controller.js";
import { distributorAuth } from "../middlewares/auth.js";
import { uploadMiddleware } from "../utils/upload.js";
import { getAllVipPackages, getDistributorPointsLog } from "../controllers/admin.controller.js";
import { getCurrentUser } from "../controllers/user.controller.js";

const router = express.Router()


router.post('/register', uploadMiddleware, registerDistributor);
router.post('/login', loginDistributor);
router.post('/get-otp', getOtpForDistributor);
router.post('/verify-otp-reset-password', verifyOtpAndChangeDistributorPassword);
router.post('/change-transactionPassword', changeTransactionPassword)

router.post('/get-all-users', distributorAuth, getAllUsers);
router.get('/get-single-user', getSingleUser);
router.post('/get-current-distributor', getCurrentDistributor); //send Id in req.body
router.post('/get-single-franchise', distributorAuth, getSingleFranchise)
router.get('/getCurrentUser/:userId', getCurrentUser)

// Reports
router.post("/reports", distributorAuth, getReportsDistributor);

//Inactivate franchise
router.put('/inactivate-franchise', distributorAuth, inactivateFranchise)

// === MESSAGES ===
router.get('/get-franchise-admin', distributorAuth, getFranchisesAndAdmin)
router.get('/get-users-under', getUsers)

router.post('/message/send', distributorAuth, sendMessageFromDistributor);
router.get('/message/get-sendMessages', distributorAuth, getSentMessagesForDistributor);

router.post('/message/draft', distributorAuth, draftMessageFromDistributor);
router.get('/message/get-draftedMessages', distributorAuth, getDraftedMessagesForDistributor);

router.get('/message/replies', distributorAuth, getRepliesForDistributor);

//=== POINTS ===
router.get('/get/pointsLog/:distributorId', getDistributorPointsLog)
router.post('/give-points-to-franchise', distributorAuth, givePointsToFranchise)
router.get('/get/franchiseLogs/:franchiseId', getFranchisePointsLog)

// === PACKAGES ===
router.post('/give-package-to-franchise', distributorAuth, givePackageToFranchise);




export default router
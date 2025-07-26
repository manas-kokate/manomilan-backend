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
    getAllActivePackages,
    allotMainPackage,
    getSingleUser,
    getUserAllotedPackages
} from "../controllers/franchise.controller.js";
import { distributorAuth, franchiseAuth } from "../middlewares/auth.js";


const router = express.Router();

router.post('/register', uploadMiddleware, distributorAuth, registerFranchise)
router.post('/login', loginFranchise);
router.put('/update/:franchiseId', uploadMiddleware, updateFranchiseProfile);
router.post('/create-member', franchiseAuth, uploadMiddleware, createMember);
router.get('/view-members', franchiseAuth, viewMember);
router.get('/get-single-user/:userId', franchiseAuth, getSingleUser);

// === MESSAGES ===
router.get('/get-distributor-admin', franchiseAuth, getDistributorAndAdmin)

router.post('/message/send', franchiseAuth, sendMessageFromFranchise)
router.get('/message/get-sendMessages', franchiseAuth, getSentMessagesForFranchise)

router.post('/message/draft', franchiseAuth, draftMessageFromFranchise)
router.get('/message/get-draftedMessages', franchiseAuth, getDraftedMessagesForFranchise);

router.get('/message/replies', franchiseAuth, getRepliesForFranchise);


// === PACKAGES ===
router.get('/get-packages', getAllActivePackages);
router.post('/allot-main-package', allotMainPackage);
router.post('/get-userPackage-track', getUserAllotedPackages)
export default router
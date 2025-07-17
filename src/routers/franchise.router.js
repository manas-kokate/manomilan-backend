import express from "express"
import { uploadMiddleware } from "../utils/upload.js";
import {
    registerFranchise, loginFranchise, updateFranchiseProfile, createMember, viewMember, sendMessageFromFranchise,
    draftMessageFromFranchise,
    getSentMessagesFromFranchise,
    getDraftMessagesFromFranchise,
    getRepliesForFranchise
} from "../controllers/franchise.controller.js";
import { distributorAuth, franchiseAuth } from "../middlewares/auth.js";

const router = express.Router();

router.post('/register', uploadMiddleware, distributorAuth, registerFranchise)
router.post('/login', loginFranchise);
router.put('/update/:franchiseId', uploadMiddleware, updateFranchiseProfile);
router.post('/create-member', franchiseAuth, uploadMiddleware, createMember);
router.get('/view-members', franchiseAuth, viewMember);

// === MESSAGES ===
router.post('/send', sendMessageFromFranchise);

router.post('/save-draft', draftMessageFromFranchise);

router.get('/sent/:franchiseId', getSentMessagesFromFranchise);

router.get('/drafts/:franchiseId', getDraftMessagesFromFranchise);

router.get('/replies/:franchiseId', getRepliesForFranchise);



export default router
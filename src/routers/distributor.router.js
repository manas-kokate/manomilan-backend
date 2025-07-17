import express from "express";
import {
    loginDistributor, registerDistributor, getAllUsers, sendMessageFromDistributor,
    draftMessageFromDistributor,
    getSentMessagesFromDistributor,
    getDraftMessagesFromDistributor,
    getRepliesForDistributor
} from "../controllers/distributor.controller.js";
import { uploadMiddleware } from "../utils/upload.js";

const router = express.Router()


router.post('/register', uploadMiddleware, registerDistributor);
router.post('/login', loginDistributor);
router.get('/get-users', getAllUsers);
// Send a message
router.post('/send', sendMessageFromDistributor);

// Save a draft
router.post('/save-draft', draftMessageFromDistributor);

// Get sent messages
router.get('/sent/:distributorId', getSentMessagesFromDistributor);

// Get draft messages
router.get('/drafts/:distributorId', getDraftMessagesFromDistributor);

// Get replies received by distributor
router.get('/replies/:distributorId', getRepliesForDistributor);

export default router
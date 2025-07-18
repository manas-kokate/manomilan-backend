import express from "express";
import {
    loginDistributor, registerDistributor, getAllUsers,
    sendMessageFromDistributor,
    getSentMessagesForDistributor,
    draftMessageFromDistributor,
    getDraftedMessagesForDistributor,
    getRepliesForDistributor
} from "../controllers/distributor.controller.js";
import { distributorAuth } from "../middlewares/auth.js";
import { uploadMiddleware } from "../utils/upload.js";

const router = express.Router()


router.post('/register', uploadMiddleware, registerDistributor);
router.post('/login', loginDistributor);
router.get('/get-users', getAllUsers);



// === MESSAGES ===
router.post('/message/send', distributorAuth, sendMessageFromDistributor);
router.get('/message/get-sendMessages', distributorAuth, getSentMessagesForDistributor);

router.post('/message/draft', distributorAuth, draftMessageFromDistributor);
router.get('/message/get-draftedMessages', distributorAuth, getDraftedMessagesForDistributor);

router.get('/message/replies', distributorAuth, getRepliesForDistributor);


export default router
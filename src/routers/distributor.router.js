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
    getCurrentDistributor
} from "../controllers/distributor.controller.js";
import { distributorAuth } from "../middlewares/auth.js";
import { uploadMiddleware } from "../utils/upload.js";

const router = express.Router()


router.post('/register', uploadMiddleware, registerDistributor);
router.post('/login', loginDistributor);
// router.get('/get-users/:upperLimit/:lowerLimit', distributorAuth, getAllUsers);
router.post('/get-all-users', distributorAuth, getAllUsers)
router.post('/get-current-distributor', getCurrentDistributor); //send Id in req.body


// === MESSAGES ===
router.get('/get-franchise-admin', distributorAuth, getFranchisesAndAdmin)
router.get('/get-users-under', getUsers)

router.post('/message/send', distributorAuth, sendMessageFromDistributor);
router.get('/message/get-sendMessages', distributorAuth, getSentMessagesForDistributor);

router.post('/message/draft', distributorAuth, draftMessageFromDistributor);
router.get('/message/get-draftedMessages', distributorAuth, getDraftedMessagesForDistributor);

router.get('/message/replies', distributorAuth, getRepliesForDistributor);


export default router
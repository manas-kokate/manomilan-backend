import express from "express"
import { uploadMiddleware } from "../utils/upload.js";
import { registerFranchise, loginFranchise, updateFranchiseProfile, createMember, viewMember } from "../controllers/franchise.controller.js";
import { distributorAuth, franchiseAuth } from "../middlewares/auth.js";

const router = express.Router();

router.post('/register', uploadMiddleware, distributorAuth, registerFranchise)
router.post('/login', loginFranchise);
router.put('/update/:franchiseId', uploadMiddleware, updateFranchiseProfile);
router.post('/create-member', franchiseAuth, uploadMiddleware, createMember);
router.get('/view-members', franchiseAuth, viewMember);



export default router
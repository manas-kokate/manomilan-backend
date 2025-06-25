import express from "express"
import { uploadMiddleware } from "../utils/upload.js";
import { registerFranchise, loginFranchise, updateFranchiseProfile, createMember } from "../controllers/franchise.controller.js";
import { franchiseAuth } from "../middlewares/auth.js";

const router = express.Router();

router.post('/register', uploadMiddleware, registerFranchise)
router.post('/login', loginFranchise);
router.put('/update/:franchiseId', uploadMiddleware, updateFranchiseProfile);
router.post('/create-member', franchiseAuth, createMember);


export default router
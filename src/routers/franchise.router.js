import express from "express"
import { uploadMiddleware } from "../utils/upload.js";
import { registerFranchise, loginFranchise, updateFranchiseProfile } from "../controllers/franchise.controller.js";

const router = express.Router();

router.post('/register', uploadMiddleware, registerFranchise)
router.post('/login', loginFranchise);
router.put('/update/:franchiseId', uploadMiddleware, updateFranchiseProfile);


export default router
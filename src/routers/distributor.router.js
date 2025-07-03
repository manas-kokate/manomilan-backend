import express from "express";
import { loginDistributor, registerDistributor, getAllUsers } from "../controllers/distributor.controller.js";
import { uploadMiddleware } from "../utils/upload.js";

const router = express.Router()


router.post('/register', uploadMiddleware, registerDistributor);
router.post('/login', loginDistributor);
router.get('/get-users', getAllUsers);

export default router
import express from "express"
import { uploadMiddleware } from "../utils/upload.js";
import { registerUser, login, getUsers } from "../controllers/user.controller.js"

const router = express.Router();

router.post('/register', uploadMiddleware, registerUser);
router.post('/login', login);
router.get('/getusers', getUsers);


export default router
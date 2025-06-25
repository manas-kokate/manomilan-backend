import express from "express";
import { loginDistributor, registerDistributor } from "../controllers/distributor.controller.js";
import { uploadMiddleware } from "../utils/upload.js";

const router = express.Router()


router.post('/register', uploadMiddleware, registerDistributor);
router.post('/login', loginDistributor);

//During create franchise use franchise register api for now. I'll ask him abt any new updates in it. If there are any I'll create new api then.

export default router
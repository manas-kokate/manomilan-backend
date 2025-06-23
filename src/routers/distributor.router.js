import express from "express";
import { registerDistributor } from "../controllers/distributor.controller.js";

const router = express.Router()


router.post('/register', registerDistributor);

export default router
import express from "express"
import { uploadMiddleware } from "../utils/upload.js";
import { registerUser, login, getUsers, addExpectations, updateExpectation } from "../controllers/user.controller.js";
import { userAuth } from "../middlewares/auth.js"
import { body } from 'express-validator';


const router = express.Router();

router.post('/register', uploadMiddleware, registerUser);
router.post('/login', login);
router.get('/getusers', userAuth, getUsers);
router.post('/addexpectations', userAuth, addExpectations);
router.put('/editexpectation',
    [
        body('monthlyIncome').optional().isNumeric().withMessage('Monthly income must be a number')
    ]
    , userAuth, updateExpectation)


export default router
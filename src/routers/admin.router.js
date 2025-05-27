import express from 'express'
import { getUsers, loginAdmin, registerAdmin, updateUserPfp, deleteUser } from '../controllers/admin.controller.js';
import { adminAuth } from '../middlewares/auth.js';

const router = express.Router();

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.get('/getusers', adminAuth, getUsers);
router.put('/updateuserpfp', adminAuth, updateUserPfp);
router.delete('/deleteruser', adminAuth, deleteUser)


export default router
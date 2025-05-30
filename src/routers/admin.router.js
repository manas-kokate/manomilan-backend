import express from 'express'
import { getUsers, loginAdmin, registerAdmin, updateUserPfp, deleteUser, getLocations, addlocation, deletelocation } from '../controllers/admin.controller.js';
import { adminAuth } from '../middlewares/auth.js';

const router = express.Router();

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.get('/getusers', adminAuth, getUsers);
router.put('/updateuserpfp', adminAuth, updateUserPfp);
router.delete('/deleteruser', adminAuth, deleteUser);
router.get('/getlocations', adminAuth, getLocations);
router.post('/addlocation', adminAuth, addlocation);
router.delete('/deletelocation', adminAuth, deletelocation)


export default router
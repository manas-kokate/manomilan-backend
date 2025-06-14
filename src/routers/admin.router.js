import express from 'express'
import { getUsers, loginAdmin, registerAdmin, updateUserPfp, deleteUser, getReligions, addReligion, getCastes, addCastes, getCasteEntry, addCasteEntry, getCountry, addcountry } from '../controllers/admin.controller.js';
import { adminAuth } from '../middlewares/auth.js';


const router = express.Router();

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);

// USERS 
router.get('/getusers', adminAuth, getUsers);
router.put('/updateuserpfp', adminAuth, updateUserPfp);
router.delete('/deleteruser', adminAuth, deleteUser);

// LOCATIONS 
router.get('/getcountries', adminAuth, getCountry);
router.post('/addcountries', adminAuth, addcountry)

//caste,subcaste,religion
router.get('/getreligions', adminAuth, getReligions);
router.post('/addreligion', adminAuth, addReligion);
router.get('/getcastes', adminAuth, getCastes);
router.post('/addcaste', adminAuth, addCastes);
router.get('/getcasteEntry', adminAuth, getCasteEntry);
router.post('/addcasteEntry', adminAuth, addCasteEntry);


export default router
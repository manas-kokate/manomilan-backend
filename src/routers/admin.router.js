import express from 'express'
import { getUsers, loginAdmin, registerAdmin, updateUserPfp, deleteUser, getcountries, getStates, getLocationEntry, addcountry, addState, addLocationEntry, getReligions, addReligion, getCastes, addCastes, getCasteEntry, addCasteEntry } from '../controllers/admin.controller.js';
import { adminAuth } from '../middlewares/auth.js';

const router = express.Router();

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);

// USERS 
router.get('/getusers', adminAuth, getUsers);
router.put('/updateuserpfp', adminAuth, updateUserPfp);
router.delete('/deleteruser', adminAuth, deleteUser);

// LOCATIONS 
router.get('/getcountries', adminAuth, getcountries);
router.get('/getstates', adminAuth, getStates);
router.get('/getlocation', adminAuth, getLocationEntry);
router.post('/addcountry', adminAuth, addcountry);
router.post('/addstate', adminAuth, addState);
router.post('/addLocationEntry', adminAuth, addLocationEntry);

//caste,subcaste,religion
router.get('/getreligions', adminAuth, getReligions);
router.post('/addreligion', adminAuth, addReligion);
router.get('/getcastes', adminAuth, getCastes);
router.post('/addcaste', adminAuth, addCastes);
router.get('/getcasteEntry', adminAuth, getCasteEntry);
router.post('/addcasteEntry', adminAuth, addCasteEntry);


export default router
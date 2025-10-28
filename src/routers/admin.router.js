import express from 'express'
import {
    getUsers,
    loginAdmin,
    registerAdmin,
    updateUserPfp,
    getCountry,
    addcountry,
    getStateCountry,
    addStateCountry,
    addlocationEntry,
    getlocationEntry,
    getAllStates,
    getAllLocations, getReligion,
    addReligion,
    getAllCastes,
    getCasteByReligion,
    addCasteReligion,
    getAllSubCastes,
    getSubCasteEntry,
    addSubCasteEntry,
    deleteCountry,
    deleteStateCountry,
    deleteCity,
    deleteReligion,
    deleteCaste,
    deleteSubCaste,
    updateCountry,
    updateState,
    updateCity,
    updateReligion,
    updateCaste,
    updateSubCaste,
    addDegree,
    addStream,
    getAllDegrees,
    getDegreesByStream,
    getAllStreams,
    deleteDegree,
    deleteStream,
    addFoodPref,
    getFoodPref,
    addBodyType,
    getBodyTypes,
    deleteBodyType,
    addComplexion,
    getComplexions,
    deleteComplexion,
    addFamilyBg,
    getFamilyBgs,
    deleteFamilyBg,
    addSect,
    getSects,
    deleteSect,
    addPosition,
    getPositions,
    deletePosition,
    addManglik,
    getMangliks,
    deleteManglik,
    getMotherTongue,
    addMotherTongue,
    deleteMotherTongue,
    deleteFoodPref,
    getDistributors,
    addNewPoints,
    givePointsToDistributor,
    getPoints,
    getSingleDistributor,
    getSingleFranchise,
    getFranchiseUnder,
    addFreePackage,
    getFreepackages,
    addVipPackage,
    getAllVipPackages,
    addMainPackage,
    getMainPackages,
    addAddOnPackage,
    getAddOnPackages,
    sendMessageFromAdmin,
    getSentMessagesForAdmin,
    draftMessageFromAdmin,
    getDraftedMessagesForAdmin,
    getRepliesForAdmin,
    getUsersUnderFranchise,
    getReports,
    searchUsers,
    updateMainPackages,
    getDistributorPointsLog,
    getCurrentAdmin,
    getOtp,
    verifyOtpAndChangePassword,
    changeTransactionPassword,
    changeGivePointsPassword,
    getSingleUser,
    inactivateDistributor,
    updateUserDetails,
    changeFranchiseEmail,
    changeDistributorEmail

} from '../controllers/admin.controller.js';
import { adminAuth } from '../middlewares/auth.js';
import { getFranchisePointsLog } from '../controllers/distributor.controller.js';


const router = express.Router();

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.get('/current-admin', adminAuth, getCurrentAdmin);

// === OTP ===
router.post('/forgot-password-otp', getOtp);
router.post('/change-password', verifyOtpAndChangePassword)
router.post('/change-transactionPassword', changeTransactionPassword)
router.post('/change-givePointsPassword', changeGivePointsPassword)

// change emails
router.put('/change-franchise-email', adminAuth, changeFranchiseEmail)
router.put('change-distributor-email', adminAuth, changeDistributorEmail)

// === USER ==== 
router.get('/get-users', getUsers);
router.put('/update-userpfp', adminAuth, updateUserPfp);
router.put('/update-user', adminAuth, updateUserDetails)
router.get('/get-single-user/:id', getSingleUser)

// === COUNTRY === 
router.get('/get-country', getCountry);
router.post('/add-country', addcountry);
router.delete('/delete-country', deleteCountry);
router.put('/update-country', updateCountry);

// ===  STATE ROUTES ===
router.post('/get-state-country', getStateCountry);
router.get('/get-all-states', getAllStates);
router.post('/add-state-country', addStateCountry);
router.delete('/delete-state-country', deleteStateCountry);
router.put('/update-state-country', updateState);

// === CITY ===
router.get('/get-all-cities', getAllLocations);
router.post('/get-state-city', getlocationEntry);
router.post('/add-state-city', addlocationEntry);
router.delete('/delete-city', deleteCity);
router.put('/update-city', updateCity);

// === RELIGION ROUTES ===
router.get('/get-religion', getReligion);
router.post('/add-religion', addReligion);
router.put('/update-religion', updateReligion);
router.delete('/delete-religion', deleteReligion);

// === CASTE ROUTES ===
router.get('/get-all-castes', getAllCastes);
router.post('/get-castes-by-religion', getCasteByReligion);
router.post('/add-caste', addCasteReligion);
router.put('/update-caste', updateCaste);
router.delete('/delete-caste', deleteCaste);

// === SUBCASTE ROUTES ===
router.get('/get-all-subcastes', getAllSubCastes);
router.post('/get-subcastes-by-entry', getSubCasteEntry);
router.post('/add-subcaste', addSubCasteEntry);
router.put('/update-subcaste', updateSubCaste);
router.delete('/delete-subcaste', deleteSubCaste);


// === EDUCATION ===

//=== DEGREE ====
router.get('/get-all-degrees', getAllDegrees);
router.get('/get-degrees-by-stream', getDegreesByStream);
router.post('/add-degree', addDegree);
router.delete('/delete-degree', deleteDegree);

// === STREAMS ===
router.get('/get-streams', getAllStreams);
router.post('/add-stream', addStream);
router.delete('/delete-stream', deleteStream);

// === FOOD CHOICES ===
router.get('/get-foodPref', getFoodPref);
router.post('/add-foodPref', addFoodPref);
router.delete('/delete-foodPref', deleteFoodPref);

// Body Type
router.post("/add-bodytype", addBodyType);
router.get("/get-bodytype", getBodyTypes);
router.delete("/delete-bodytype", deleteBodyType);

// Complexion
router.post("/add-complexion", addComplexion);
router.get("/get-complexion", getComplexions);
router.delete("/delete-complexion", deleteComplexion);

// Family Background
router.post("/add-familybg", addFamilyBg);
router.get("/get-familybg", getFamilyBgs);
router.delete("/delete-familybg", deleteFamilyBg);

// Sect
router.post("/add-sect", addSect);
router.get("/get-sect", getSects);
router.delete("/delete-sect", deleteSect);

// Position
router.post("/add-position", addPosition);
router.get("/get-position", getPositions);
router.delete("/delete-position", deletePosition);

// Manglik
router.post("/add-manglik", addManglik);
router.get("/get-manglik", getMangliks);
router.delete("/delete-manglik", deleteManglik);

// === MOTHER TONGUE ===
router.get('/get-mother-tongue', getMotherTongue);
router.post('/add-mother-tongue', addMotherTongue);
router.delete('/delete-mother-tongue', deleteMotherTongue);

// === DISTRIBUTORS ===
router.get('/get-distributors', getDistributors);
router.get('/get-franchise-under/:id', getFranchiseUnder);
router.put('/inactivate-distributor', inactivateDistributor)

// === POINTS ===
router.post('/add-points', adminAuth, addNewPoints);
router.get('/get-points', adminAuth, getPoints);
router.post('/give-points-to-distributor', adminAuth, givePointsToDistributor);
router.get('/get/franchiseLogs/:franchiseId', getFranchisePointsLog)
router.get('/get/pointsLog/:distributorId', getDistributorPointsLog)
router.get('/get-single-franchise/:id', adminAuth, getSingleFranchise);
router.get('/get-single-distributor/:id', adminAuth, getSingleDistributor);

// === PACKAGES === 
// Free Package Routes
router.post('/add-free-packages', addFreePackage);
router.get('/get-free-packages', getFreepackages);

// VIP Package Routes
router.post('/add-vip-packages', addVipPackage);
router.get('/get-vip-packages', getAllVipPackages);

// Main Package Routes
router.post('/add-main-packages', addMainPackage);
router.post('/activate-main-packages', updateMainPackages)
router.get('/get-main-packages', getMainPackages);

// Add-on Package Routes
router.post('/add-addon-packages', addAddOnPackage);
router.get('/get-addon-packages', getAddOnPackages);


// === MESSAGES ===
router.get('/get-Users-Under/:id', getUsersUnderFranchise)

router.post('/message/send', adminAuth, sendMessageFromAdmin);
router.get('/message/get-sendMessages', adminAuth, getSentMessagesForAdmin);

router.post('/message/draft', adminAuth, draftMessageFromAdmin);
router.get('/message/get-draftedMessages', adminAuth, getDraftedMessagesForAdmin);

router.get('/message/replies', adminAuth, getRepliesForAdmin);

// === REPORTS ===
router.post('/get-reports', getReports);
router.post('/search-by-anything', searchUsers)


export default router
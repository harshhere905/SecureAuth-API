import express from 'express'
const router=express.Router();
import { RegisterUser, loginUser, getUser, getAccessToken,logoutUser,logoutAllUser,verifyEmail } from '../controllers/user.controller.js';


router.post('/register',RegisterUser);
router.post('/login',loginUser)
router.post('/verify',verifyEmail)
router.get('/get-user',getUser)
router.get('/refresh',getAccessToken)
router.get('/logout',logoutUser)
router.get('/logoutAll',logoutAllUser)

export default router

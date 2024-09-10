import express from 'express'
import { login, setSelectedPreferences, userSignup, verifyOtp } from '../../controllers/userControllers/userAuthController.js'
import authenticateJWT from '../../middlewares/userAuth.js'


const router = express.Router()

router.post('/signup', userSignup)
router.post('/verify-otp', verifyOtp)
router.post('/complete-signup', setSelectedPreferences)
router.post('/login', login)
// router.post(authenticateJWT)


export default router;
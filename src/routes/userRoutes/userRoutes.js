import express from 'express'
import { login, setSelectedPreferences, userSignup, verifyOtp } from '../../controllers/userControllers/userAuthController.js'
import authenticateJWT from '../../middlewares/userAuth.js'
import { createArticles, getPreference, getUserArticles } from '../../controllers/userControllers/userController.js'


const router = express.Router()

router.post('/signup', userSignup)
router.post('/verify-otp', verifyOtp)
router.post('/complete-signup', setSelectedPreferences)
router.post('/login', login)
router.get('/preferences',getPreference,)
router.post('/articles', createArticles)
router.get('/home/:userId', getUserArticles);
// router.post(authenticateJWT)


export default router;
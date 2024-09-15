import express from 'express'
import { login, setSelectedPreferences, userSignup, verifyOtp } from '../../controllers/userControllers/userAuthController.js'
import authenticateJWT from '../../middlewares/userAuth.js'
import { createArticles, dislikeArticle, getArticles, getPreference, getUserArticles, likeArticle } from '../../controllers/userControllers/userController.js'


const router = express.Router()

router.post('/signup', userSignup)
router.post('/verify-otp', verifyOtp)
router.post('/complete-signup', setSelectedPreferences)
router.post('/login', login)
router.get('/preferences',getPreference,)
router.post('/articles',authenticateJWT, createArticles)
router.get('/home/:userId',authenticateJWT, getArticles);
router.get('/my-articles',authenticateJWT, getUserArticles)
router.put('/article/:articleId/like',  likeArticle);
router.put('/article/:articleId/dislike', dislikeArticle);


export default router;
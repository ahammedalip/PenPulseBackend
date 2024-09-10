import express from 'express'
import { editPreference, getPreference, login, preferences } from '../../controllers/adminControllers/adminAuthController.js';
import authenticateJWT from '../../middlewares/adminAuth.js';


const router = express.Router()

router.post('/login', login)
router.post(authenticateJWT)
router.post('/preference', preferences)
router.get('/preference', getPreference)
router.put('/preference/:id', editPreference)




export default router;
import express from 'express'
import { login } from '../../controllers/adminControllers/adminAuthController.js';


const router = express.Router()

router.post('/login', login)




export default router;
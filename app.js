import express, { urlencoded } from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import morgan from 'morgan'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import adminRoutes from './src/routes/adminRoutes/adminRoutes.js'
import userRoutes from './src/routes/userRoutes/userRoutes.js'


const app = express()
dotenv.config()

app.use(cookieParser());
app.use(express.json())

app.use(urlencoded({extended:true}))
app.use(morgan('tiny'));
app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true
}))

const PORT = process.env.PORT || 3000

app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`)
})
mongoose.connect(process.env.MONGO)
    .then(()=>console.log("Connected to mongodb"))
    .catch((err)=>{
        console.log('Error in mongoDB', err)
        
    })


app.use('/api/admin', adminRoutes)
app.use('/api/user', userRoutes)
import express from 'express'
import mongoose from 'mongoose';
import userRouter from './router/user.js'
import transactionRouter from './router/transaction.js'
import cors from 'cors'
import { config } from 'dotenv';
const app = express();
app.use(express.json())
config({ path: '.env' })
app.use(cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}))
app.use('/user', userRouter)
app.use('/transaction', transactionRouter)
const port = 1000

mongoose
    .connect(process.env.Mongo_URL, {
        dbName: "Bank_API"
    })
    .then(() => console.log("MongoDB Connected Successfully"))
    .catch(() => console.log("Internal Server Error"))

app.listen(port, console.log(`Server is Running on Port ${port}`))
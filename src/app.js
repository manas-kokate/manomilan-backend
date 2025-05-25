import express from "express";
import userRouter from './routers/user.routers.js'
import cors from 'cors'

const app = express();

app.use(cors())

app.use(express.json());

app.use("/api/user", userRouter)

export default app
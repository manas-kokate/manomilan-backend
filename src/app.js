import express from "express";
import userRouter from './routers/user.routers.js'
import cors from 'cors'
import adminRouter from './routers/admin.router.js'

const app = express();

app.use(cors())

app.use(express.json());

app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);


// findOne({ userId }, '-_id -userId -createdAt -updatedAt -__v')

export default app
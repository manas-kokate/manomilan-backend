import express from "express";
import userRouter from './routers/user.routers.js';
import adminRouter from './routers/admin.router.js'

const app = express();

app.use(express.json());

app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter)

export default app
import express from "express";
import userRouter from './routers/user.routers.js'
import cors from 'cors'
import adminRouter from './routers/admin.router.js'

const app = express();

app.use(cors())

app.use(express.json());

app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);

// get single user,mutual matching,[(city,state,country)(category,caste,subcaste)]API,user can edit education table OR profile, login detils (create user without filling form)  

export default app
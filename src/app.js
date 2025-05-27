import express from "express";
<<<<<<< HEAD
import userRouter from './routers/user.routers.js'
import cors from 'cors'
=======
import userRouter from './routers/user.routers.js';
import adminRouter from './routers/admin.router.js'
>>>>>>> 97ffb0decc3c10c6920d21f29af75c6c6e84e525

const app = express();

app.use(cors())

app.use(express.json());

app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter)

export default app
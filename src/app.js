import express from "express";
import userRouter from './routers/user.routers.js'
import cors from 'cors'
import adminRouter from './routers/admin.router.js'
import franchiseRouter from "./routers/franchise.router.js"
import distributorRouter from "./routers/distributor.router.js"

const app = express();

app.use(cors())

app.use(express.json());

app.use((err, req, res, next) => {
    if (err) {
        return res.send({ status: false, message: "Bad request. Check your request body and send request properly." })
    }
    next()
})

app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use('/api/franchise', franchiseRouter);
app.use('/api/distributor', distributorRouter)

export default app
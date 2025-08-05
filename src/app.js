import express from "express";
import userRouter from './routers/user.routers.js'
import cors from 'cors'
import adminRouter from './routers/admin.router.js'
import franchiseRouter from "./routers/franchise.router.js"
import distributorRouter from "./routers/distributor.router.js"
import path from "path";
import { fileURLToPath } from 'url';

// Emulate __dirname in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// #7d0a0a and white 

const app = express();

// Static middleware to serve files from 'upload/'
app.use('/upload', express.static(path.join(__dirname, 'upload')));

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
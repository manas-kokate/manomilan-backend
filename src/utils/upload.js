import multer from "multer";
import fs from 'fs';
import path from 'path';
import envCredentials from "../config/env.js";




const folderPath = envCredentials.folderPath
const uploadFolder = path.join(folderPath, 'upload');

if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder)
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'upload')
    },
    filename: function (req, file, cb) {
        const uniquefilename = Date.now() + "-" + file.originalname
        cb(null, uniquefilename)
    }
})


const upload = multer({ storage: storage }).fields([
    { name: 'profilePic', maxCount: 1 },
    { name: 'franchisePhoto', maxCount: 1 },
    { name: 'qrPhoto', maxCount: 1 }
]);


export const uploadMiddleware = (req, res, next) => {
    upload(req, res, (err) => {
        if (err) {
            console.log(err)
            return res.send({ status: false, message: "file not uploaded" })
        }
        next()
    })
}
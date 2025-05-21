import dotenv from "dotenv"
dotenv.config()


const envCredentials = {
    mongoUrl: process.env.mongoUrl,
    passkey: process.env.passkey,
    folderPath: process.env.folderPath,
    secretKey: process.env.jwtSecretKey
}



export default envCredentials
import express from "express";
import app from "./app.js";
import connectDb from "./config/db.js"


const server = async () => {
    try {
        app.listen(8000, () => {
            console.log("Your Server is running..!")
        })
        await connectDb()
    } catch (error) {
        console.log("Server Error..!")
    }
}

server()
import express from "express"
import dotenv from "dotenv";
import cors from "cors"
import DB_CONNECT from "./db/db.js"
import cookieParser from "cookie-parser";

dotenv.config({
    path: "./env"
})

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))

app.use(express.urlencoded({extended: true, limit: "16kb"}))

app.use(express.static("public"))

app.use(cookieParser())

//routes import
import userRoute from "./routes/user.route.js"

//routes declaration
app.use("/api/v1/users", userRoute)

DB_CONNECT();

app.listen(process.env.PORT || 8000, () => {
    console.log(`SERVER IS RUNNING ON ${process.env.PORT || 8000} and https//localhost:${process.env.PORT || 8000}` )
})
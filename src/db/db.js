import mongoose from "mongoose"
import DB_NAME from "../constants.js"
import dotenv from "dotenv"
dotenv.config({
    path: "./env"
})


const DB_CONNECT = async () => {
        try {
            await mongoose.connect(`mongodb+srv://samreenmalik52292:6DBKy67rPj6VAh8s@cluster0.scly98l.mongodb.net`)
            console.log("\n db connected secseccfully");
        } catch (error) {
            console.error("ERROR : ", error)
        }
    }

export default DB_CONNECT;    



import mongoose from "mongoose"

const DB_CONNECT = async () => {
        try {
            await mongoose.connect(`${process.env.DB_URL}`)
            console.log("\n db connected secseccfully");
        } catch (error) {
            console.error("ERROR : ", error)
        }
    }

export default DB_CONNECT;    



import mongoose from 'mongoose'
import 'dotenv/config';

async function connectDB (){
    try{
        await mongoose.connect(process.env.MONGO_URI)
    } catch(error){
        console.error("Hubo un error conectando con la base de datos", error)
        process.exit(1)
    }
}

export default connectDB;
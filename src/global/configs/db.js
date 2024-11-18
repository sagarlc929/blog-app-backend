// db.js
import mongoose from 'mongoose';
import 'dotenv/config';

const conn = async () =>{
  try{
    await mongoose.connect(process.env.DATABASE_URL)
  }catch(error){
    console.log(error);
  }
}
conn();

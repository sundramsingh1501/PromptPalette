import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  creditBalance:{
    type:Number,
    default:5,
  }
})

const userModel = mongoose.model("user", userSchema)
export default userModel

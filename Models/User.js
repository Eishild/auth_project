import mongoose from "mongoose"
const { Schema, model } = mongoose

const userSchema = new Schema({
  firstName: { type: String, trim: true, required: true },
  lastName: { type: String, trim: true, required: true },
  email: { type: String, trim: true, required: true },
  password: { type: String, trim: true, required: true },
})

const User = model("User", userSchema)

export default User

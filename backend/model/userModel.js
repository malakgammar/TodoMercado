import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    cin: { type: String, unique: true, required: true }, 
    nom: { type: String, required: true }, 
    telephone: { type: String, unique: true, required: true }, 
    email: { type: String, required: true }, 
    password: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

export default mongoose.model("Users", userSchema);
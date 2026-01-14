import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    prix: { type: Number, required: true },
    description: { type: String, required: true },
    photo: { type: String, required: true },
    idCategorie: { type: String, required: true }
});

export default mongoose.model("Product", productSchema);
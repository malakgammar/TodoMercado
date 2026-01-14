import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    nom: { type: String, required: true, unique: true, trim: true },
    description: { type: String, trim: true},
    dateCréation: { type: Date, default: Date.now}
});

export default mongoose.model('Category', categorySchema);

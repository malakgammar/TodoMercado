import mongoose from 'mongoose';

const panierSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    produits: [{
        idproduit: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, 
        quantite: { type: Number, required: true, min: 1 },
        prixUnitaire: { type: Number, required: true }
    }],
    total: { type: Number, required: true, default: 0 },
    statut: { type: String, default: 'en attente' } 
}, { timestamps: true });

export default mongoose.model('Panier', panierSchema);
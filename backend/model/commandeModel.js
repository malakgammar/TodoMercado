import mongoose from 'mongoose';

const commandeSchema = new mongoose.Schema({
    userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
},
produits: [
    {
        idproduit: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        quantite: Number,
        prixUnitaire: Number
    }
],
total: {
    type: Number,
    required: true
},
    status: {
        type: String,
        enum: ["En attente","confirmée", "annulée", "livrée"],
        default: "En attente"
    },
        timestamp: { type: Date, default: Date.now } 

});

export default mongoose.model('Commande', commandeSchema);

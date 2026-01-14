import express from "express";

import { deleteCommande, fetchUserCommandes, updateStatus, createFromPanier} from "../controller/commandeController.js";
import authMiddleware from "../middleware/authMiddleware.js";
const commandeRoute = express.Router();

commandeRoute.delete("/deleteC/:id", deleteCommande); // Supprimer une commande (admin)

// --- Routes utilisateur authentifié ---
commandeRoute.post("/from-panier", authMiddleware, createFromPanier);  // Confirmer le panier -> commande
commandeRoute.get("/mycommandes", authMiddleware, fetchUserCommandes); // Historique commandes
commandeRoute.put("/update-status/:id", authMiddleware, updateStatus); // Mettre à jour le statut d'une commande (ex: annuler)

export default commandeRoute;

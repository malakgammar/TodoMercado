import express from 'express';
import authenticate from '../middleware/authMiddleware.js';
import panierController from '../controller/panierController.js';
import authMiddleware from "../middleware/authMiddleware.js";

const panierRoute = express.Router();

panierRoute.post('/ajouter', authMiddleware, panierController.ajouterAuPanier);
panierRoute.get('/', authMiddleware, panierController.obtenirPanier);
panierRoute.delete('/supprimer/:idproduit', authMiddleware, panierController.supprimerDuPanier);
panierRoute.put('/modifier/:idproduit', authMiddleware, panierController.modifierQuantite);


export default panierRoute;
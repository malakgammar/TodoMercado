import Commande from "../model/commandeModel.js";
import Panier from "../model/panierModel.js";

export const createFromPanier = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Utilisateur non authentifié" });
        }

        const userId = req.user.id;

        const panier = await Panier.findOne({ userId }).populate('produits.idproduit');

        if (!panier) {
            return res.status(404).json({ message: "Panier introuvable" });
        }

        if (panier.produits.length === 0) {
            return res.status(400).json({ message: "Panier vide" });
        }

        if (!panier.total || panier.total <= 0) {
            return res.status(400).json({ message: "Total invalide" });
        }

        const produitsCommande = panier.produits.map(item => ({
            idproduit: item.idproduit._id,
            quantite: item.quantite,
            prixUnitaire: item.prixUnitaire
        }));

        const commande = new Commande({
            userId,
            produits: produitsCommande,
            total: panier.total,
            status: "confirmée"
        });

        await commande.save();

        panier.produits = [];
        panier.total = 0;
        panier.statut = "confirmé";
        await panier.save();

        res.status(201).json({
            message: "Commande créée avec succès",
            commande
        });

    } catch (error) {
        console.error(" ERREUR COMMANDE :", error);
        res.status(500).json({
            message: "Erreur serveur",
            error: error.message
        });
    }
};

export const updateStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const { status } = req.body;

        if (!status) return res.status(400).json({ message: "Le statut est requis." });

        const commandeExist = await Commande.findById(id);
        if (!commandeExist) return res.status(404).json({ message: "Commande non trouvée." });

        // Vérifier que le statut est valide
        const validStatus = ["En attente", "confirmée", "annulée", "livrée"];
        if (!validStatus.includes(status)) {
            return res.status(400).json({ message: "Statut invalide." });
        }

        commandeExist.status = status;
        await commandeExist.save();

        res.status(200).json({ message: "Statut mis à jour avec succès", commande: commandeExist });
    } catch (error) {
        console.error("Erreur updateStatus :", error);
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

export const fetchUserCommandes = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Utilisateur non authentifié" });
        }

        const userId = req.user.id;

        const commandes = await Commande.find({ userId })
            .populate("produits.idproduit");

        if (!commandes || commandes.length === 0) {
            return res.status(404).json({ message: "Aucune commande trouvée pour cet utilisateur." });
        }

        res.status(200).json(commandes);
    } catch (error) {
        console.error("Erreur fetchUserCommandes :", error);
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};


// Supprimer / annuler une commande
export const deleteCommande = async (req, res) => {
    try {
        const id = req.params.id;
        const commandeExist = await Commande.findById(id);
        if (!commandeExist) return res.status(404).json({ message: "Commande non trouvée." });

        await Commande.findByIdAndDelete(id);
        res.status(200).json({ message: "Commande annulée avec succès." });
    } catch (error) {
        console.error("Erreur deleteCommande :", error);
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};
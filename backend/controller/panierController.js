// controller/panierController.js
import Panier from "../model/panierModel.js"; 
import Produit from "../model/productModel.js";

const ajouterAuPanier = async (req, res) => {
    const { idproduit, quantite } = req.body;
    const userId = req.user.id;

    console.log('idproduit:', idproduit);
    console.log('quantite:', quantite);
    console.log('userId:', userId);

    try {
        const produit = await Produit.findById(idproduit);
        if (!produit) {
            console.log('Produit non trouvé');
            return res.status(404).json({ message: 'Produit non trouvé.' });
        }

        let panier = await Panier.findOne({ userId });
        if (!panier) {
            console.log('Aucun panier trouvé, création d\'un nouveau panier');
            panier = new Panier({
                userId,
                produits: [],
                total: 0,
            });
        }

        const itemIndex = panier.produits.findIndex(item => item.idproduit.toString() === idproduit);
        if (itemIndex > -1) {
            panier.produits[itemIndex].quantite += quantite;
        } else {
            panier.produits.push({
                idproduit,
                quantite,
                prixUnitaire: produit.prix,
            });
        }

        panier.total = panier.produits.reduce((acc, item) => acc + (item.quantite * item.prixUnitaire), 0);

        await panier.save();
        console.log('Panier mis à jour:', panier);
        res.json({ message: 'Produit ajouté au panier.', panier });
    } catch (error) {
        console.error('Erreur lors de l\'ajout au panier:', error);
        res.status(500).json({ message: 'Erreur lors de l\'ajout au panier.', error });
    }
};


const obtenirPanier = async (req, res) => {
    const userId = req.user.id;
    console.log('User ID:', userId); // Vérifie que l'ID est bien récupéré

    try {
        const panier = await Panier.findOne({ userId }).populate({
            path: 'produits.idproduit',
            model: 'Product' // <-- ce nom doit correspondre à celui défini dans mongoose.model()
          });
          

        if (!panier) {
            return res.status(404).json({ message: 'Panier vide.' });
        }

        res.json({ panier, idPanier: panier._id, });
    } catch (error) {
        console.error('Erreur:', error); // Log de l'erreur pour faciliter le débogage
        res.status(500).json({ message: 'Erreur lors de la récupération du panier.', error });
    }
};


const supprimerDuPanier = async (req, res) => {
    const idproduit = req.params.idproduit;
    const userId = req.user.id;

    try {
        const panier = await Panier.findOne({ userId });
        if (!panier) {
            return res.status(404).json({ message: 'Panier vide.' });
        }

        panier.produits = panier.produits.filter(item => item.idproduit.toString() !== idproduit);
        panier.total = panier.produits.reduce((acc, item) => acc + (item.quantite * item.prixUnitaire), 0);

        await panier.save();
        res.json({ message: 'Produit supprimé du panier.', panier });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression du produit.', error });
    }
};
const modifierQuantite = async (req, res) => {
    const { quantite } = req.body;
    const { idproduit } = req.params;
    const userId = req.user.id;

    if (quantite < 1) {
        return res.status(400).json({ message: "Quantité invalide" });
    }

    try {
        const panier = await Panier.findOne({ userId });
        if (!panier) {
            return res.status(404).json({ message: "Panier introuvable" });
        }

        const item = panier.produits.find(
            p => p.idproduit.toString() === idproduit
        );

        if (!item) {
            return res.status(404).json({ message: "Produit non trouvé dans le panier" });
        }

        item.quantite = quantite;

        panier.total = panier.produits.reduce(
            (acc, p) => acc + p.quantite * p.prixUnitaire,
            0
        );

        await panier.save();
        res.json({ message: "Quantité mise à jour", panier });

    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
};

export default {
    ajouterAuPanier,
    obtenirPanier,
    supprimerDuPanier,
    modifierQuantite
};

import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const [cart, setCart] = useState([]);

    const addToCart = async (produit_id, quantite = 1) => {
        if (!user) {
            alert("Veuillez vous connecter pour ajouter au panier.");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                "http://localhost:5000/panier/ajouter",
                { produit_id, quantite },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setCart(response.data.panier);
            alert("Produit ajouté au panier !");
        } catch (error) {
            console.error("Erreur lors de l'ajout au panier :", error);
            alert(error.response?.data?.message || "Erreur lors de l'ajout au panier.");
        }
    };

    return (
        <CartContext.Provider value={{ cart, addToCart }}>
            {children}
        </CartContext.Provider>
    );
};

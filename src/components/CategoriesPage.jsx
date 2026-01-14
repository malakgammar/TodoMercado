import React, { useEffect, useState } from "react";
import "./CategoriesPage.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";

const CategoriesPage = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [quantities, setQuantities] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const navigate = useNavigate();

    const fetchProducts = async () => {
        try {
            const response = await fetch("http://localhost:5000/product/getallproducts");
            if (!response.ok) {
                throw new Error("Erreur lors de la récupération des produits");
            }
            const data = await response.json();
            setProducts(data);

            const initialQuantities = data.reduce((acc, product) => {
                acc[product._id] = 1;
                return acc;
            }, {});
            setQuantities(initialQuantities);
        } catch (error) {
            console.error("Erreur :", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await fetch("http://localhost:5000/category/getallcategories");
            if (!response.ok) {
                throw new Error("Erreur lors de la récupération des catégories");
            }
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error("Erreur :", error);
            setError(error.message);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const handleQuantityChange = (productId, value) => {
        setQuantities((prevQuantities) => ({
            ...prevQuantities,
            [productId]: Number(value),
        }));
    };

    const handleAddToCart = async (productId, productName) => {
        const quantity = quantities[productId] || 1;
        const token = localStorage.getItem("token");
    
        if (!token) {
            alert("Vous devez être connecté pour ajouter un produit au panier.");
            navigate("/authentification");
            return;
        }
    
        if (isNaN(quantity) || quantity <= 0) {
            alert("Veuillez entrer une quantité valide.");
            return;
        }
    
        try {
            const response = await fetch("http://localhost:5000/panier/ajouter", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    idproduit: productId,
                    quantite: quantity,
                }),
            });
    
            if (response.status === 401 || response.status === 403) {
                alert("Session expirée ou non autorisée. Veuillez vous reconnecter.");
                navigate("/login");
                return;
            }
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Erreur lors de l'ajout au panier.");
            }
    
            // Redirection vers le panier
            navigate("/panier");
    
        } catch (error) {
            console.error("Erreur :", error);
            alert(error.message || "Erreur lors de l'ajout au panier.");
        }
    };
    

    const handleShowDetails = (product) => {
        setSelectedProduct(product);
    };

    const handleCloseDetails = () => {
        setSelectedProduct(null);
    };

    const filteredProducts = products.filter((product) => {
        const matchesCategory = selectedCategory ? product.idCategorie === selectedCategory : true;
        const matchesSearch = product.nom.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    if (loading) {
        return <p className="loading">Chargement des produits...</p>;
    }

    if (error) {
        return <p className="error">Erreur : {error}</p>;
    }

    return (
        <div className="categories-page">
            <h1>Liste des Produits</h1>

            <div className="filters">
                <div className="search-filter">
                    <FontAwesomeIcon icon={faSearch} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Rechercher..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="category-filter">
                    <select
                        id="category"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="">Toutes les catégories</option>
                        {categories.map((category) => (
                            <option key={category._id} value={category._id}>
                                {category.nom}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {filteredProducts.length === 0 ? (
                <p className="no-products">Aucun produit trouvé.</p>
            ) : (
                <div className="product-list">
                    {filteredProducts.map((product) => (
                        <div key={product._id} className="product-card">
                            <img src={product.photo} alt={product.nom} />
                            <h3>{product.nom}</h3>
                            <p className="productPrice">{product.prix.toFixed(2)} MAD</p>
                            <input
                                type="number"
                                min="1"
                                value={quantities[product._id] || 1}
                                onChange={(e) => handleQuantityChange(product._id, e.target.value)}
                                className="quantityInput"
                            />
                            <button
                                onClick={() => handleAddToCart(product._id, product.nom)}
                            >
                                Ajouter au panier
                            </button>
                            <button onClick={() => handleShowDetails(product)}>
                                Voir détails
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {selectedProduct && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={handleCloseDetails}>&times;</span>
                        <h2>{selectedProduct.nom}</h2>
                        <img src={selectedProduct.photo} alt={selectedProduct.nom} />
                        <p>{selectedProduct.description}</p>
                        <p className="productPrice">{selectedProduct.prix.toFixed(2)} MAD</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoriesPage;

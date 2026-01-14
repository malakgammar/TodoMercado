import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import './Profile.css';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [commandes, setCommandes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setUpdatedUser(user);
      fetchCommandes();
    }
  }, [user]);

  const toggleEditMode = () => setEditMode(!editMode);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    if (!user || !user.id) {
      setError('Utilisateur non trouvé.');
      return;
    }
    try {
      const res = await axios.put(`http://localhost:5000/user/updateU/${user.id}`, updatedUser);
      setSuccessMessage('Informations mises à jour avec succès !');
      setError('');
      setEditMode(false);
      setUser(res.data);
      localStorage.setItem('user', JSON.stringify(res.data));
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour.');
    }
  };

  const goToCart = () => navigate('/panier');

  const fetchCommandes = async () => {
    try {
      const res = await axios.get('http://localhost:5000/commande/mycommandes', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setCommandes(res.data);
    } catch (err) {
      console.error("Erreur fetch commandes :", err);
      setError(err.response?.data?.message || 'Erreur lors de la récupération des commandes');
    }
  };

  const annulerCommande = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/commande/update-status/${id}`,
        { status: 'annulée' },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      fetchCommandes();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Impossible d'annuler la commande");
    }
  };

  if (!user) return <div>Chargement...</div>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Bienvenue, {user.nom} !</h1>
        <div className="cart-icon" onClick={goToCart}>
          <FaShoppingCart size={24} />
        </div>
      </div>

      <div className="profile-info">
        {editMode ? (
          <>
            <div><label>CIN</label><input type="text" name="cin" value={updatedUser.cin} onChange={handleChange} /></div>
            <div><label>Nom</label><input type="text" name="nom" value={updatedUser.nom} onChange={handleChange} /></div>
            <div><label>Téléphone</label><input type="tel" name="telephone" value={updatedUser.telephone} onChange={handleChange} /></div>
            <div><label>Email</label><input type="email" name="email" value={updatedUser.email} onChange={handleChange} /></div>
            <button onClick={handleUpdate}>Enregistrer</button>
            <button onClick={toggleEditMode}>Annuler</button>
          </>
        ) : (
          <>
            <p><strong>CIN :</strong> {user.cin}</p>
            <p><strong>Nom :</strong> {user.nom}</p>
            <p><strong>Téléphone :</strong> {user.telephone}</p>
            <p><strong>Email :</strong> {user.email}</p>
            <button onClick={toggleEditMode}>Modifier mes informations</button>
          </>
        )}
        {successMessage && <p className="success-message">{successMessage}</p>}
        {error && <p className="error">{error}</p>}
      </div>

      {commandes.length === 0 ? (
  <p className="no-orders">Aucune commande pour le moment.</p>
) : (
  commandes.map((commande) => (
    <div key={commande._id} className="commande-card">
<p><strong>Statut :</strong> {commande.status}</p>
              <p><strong>Total :</strong> MAD{commande.total.toFixed(2)}</p>
              <div>
                <strong>Produits :</strong>
                <ul>
                  {commande.produits.map((item) => (
                    <li key={item.idproduit._id}>
                      {item.idproduit.nom} - {item.quantite} x MAD{item.prixUnitaire.toFixed(2)}
                    </li>
                  ))}
                </ul>
              </div>
              {commande.status === "En attente" && (
                <button onClick={() => annulerCommande(commande._id)}>Annuler</button>
              )}
                  </div>
  ))
)}


      <div className="thank-you-message">
        <p>
          Cher(e) {user.nom},<br />
          Nous tenons à vous remercier pour votre fidélité et votre confiance en TodoMercado.
          Votre satisfaction est notre priorité, et nous sommes ravis de vous compter parmi nos clients.
          <br />
          L'équipe TodoMercado.
        </p>
      </div>
    </div>
  );
};

export default Profile;

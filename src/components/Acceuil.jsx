import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Loader from './Loader'; 
import './Acceuil.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Slider from 'react-slick';

export const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();


    return (
        <header className="header">
            <div className="logo">
                <Link to="/"><img src="/logo.png" alt="Logo TodoMercado" /></Link>
            </div>
            <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? '✖' : '☰'}
            </button>
            <nav className={`nav ${isMenuOpen ? 'open' : ''}`}>
                <ul>
                    <li><Link to="/product">Produits</Link></li>
                    <li><a href="#coupons">À Propos</a></li>
                    <li><a href="#temoignages">Contact</a></li>
                    <li><Link to="/authentification">Profil</Link></li>
                    
                </ul>
            </nav>
        </header>
    );
};

export const Acceuil = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState({ name: '', email: '', message: '', rating: 0 });

    useEffect(() => {
        AOS.init();
        setTimeout(() => setLoading(false), 2000);
    }, []);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await fetch("http://localhost:5000/message/getallmessages");
                if (!response.ok) throw new Error("Erreur lors de la récupération des messages");
                const data = await response.json();
                setMessages(data);
            } catch (error) {
                console.error("Erreur :", error);
            }
        };
        fetchMessages();
    }, []);

    const handleProductClick = () => {
        setLoading(true);
        setTimeout(() => navigate('/product'), 500);
    };

    if (loading) return <Loader />;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/message/createM", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newMessage),
            });
            if (!response.ok) throw new Error("Erreur lors de l'ajout du témoignage");

            const addedMessage = await response.json();
            setMessages([...messages, addedMessage]);
            setNewMessage({ name: '', email: '', message: '', rating: 0 });
        } catch (error) {
            console.error("Erreur :", error);
        }
    };

    const handleStarClick = (rating) => {
        setNewMessage({ ...newMessage, rating });
    };

    const provinces = [
        { name: "Casablanca", location: "Centre-Ouest" },
        { name: "Rabat", location: "Nord-Ouest" },
        { name: "Marrakech", location: "Centre" },
        { name: "Fès", location: "Nord" }
    ];

    return (
        <div className="acceuil">
            <div className="carousel">
                <Slider dots infinite speed={500} slidesToShow={1} slidesToScroll={1} autoplay autoplaySpeed={2000}>
                    <div><img src="/carou1.png" alt="Carrousel 1" /></div>
                    <div><img src="/carou2.png" alt="Carrousel 2" /></div>
                    <div><img src="/carou3.png" alt="Carrousel 3" /></div>
                </Slider>
            </div>

            <main className="main">
                <section className="hero" data-aos="fade-up">
                    <h2>Bienvenue chez</h2>
                    <h1>TodoMercado</h1>
                    <p>Découvrez nos produits en gros et nos meilleures offres!</p>
                    <button onClick={handleProductClick} className="cta-button">
                        Voir les produits
                    </button>
                </section>

                <section id="historique" className="historique" data-aos="fade-up">
                    <h2>Notre Histoire</h2>
                    <p>
                        Fondé en 2025, TodoMercado a commencé comme une plateforme de vente de produits locaux. 
                        Grâce à notre engagement envers la qualité et le service client, nous avons rapidement grandi pour devenir 
                        un acteur important du commerce en ligne.
                    </p>
                </section>

                <section className="provinces">
                    <h2>Nos Provinces</h2>
                    <div className="province-boxes">
                        {provinces.map((province) => (
                            <div className="province-box" key={province.name} data-aos="zoom-in">
                                <h3>{province.name}</h3>
                                <p><strong>Localisation : </strong>{province.location}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="missions">
                    <h2>Nos Missions</h2>
                    <div className="mission-boxes">
                        {['Fournir une expérience d\'achat exceptionnelle', 
                          'Promouvoir des pratiques durables', 
                          'Soutenir les communautés locales', 
                          'Offrir un service client de qualité'].map((mission) => (
                            <div className="mission-box" key={mission} data-aos="zoom-in">
                                <h3>{mission}</h3>
                                <p>Nous nous engageons à réaliser cette mission pour le bien de nos clients et de la société.</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="valeurs">
                    <h2>Nos Valeurs</h2>
                    <div className="valeur-boxes">
                        {['Qualité', 'Intégrité', 'Innovation', 'Responsabilité Sociale'].map((valeur) => (
                            <div className="valeur-box" key={valeur} data-aos="zoom-in">
                                <h3>{valeur}</h3>
                                <p>Nous valorisons cette qualité dans tout ce que nous faisons.</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="temoignages" id="temoignages">
                    <h2>Témoignages Clients</h2>
                    <div className="temoignage-boxes">
                        {messages.length > 0 ? (
                            messages.map(({ _id, name, email, message, rating }) => (
                                <div className="temoignage-box" data-aos="zoom-in" key={_id}>
                                    <div className="profile">
                                        <img src="/photoProfile.png" alt={name} className="avatar" />
                                        <div className="profile-info">
                                            <h3>{name}</h3>
                                            <p className="email">{email}</p>
                                        </div>
                                    </div>
                                    <p className="message">{message}</p>
                                    <div className="stars">
                                        {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>Aucun témoignage disponible pour le moment.</p>
                        )}
                    </div>
                </section>

                <section className="ajout-temoignage">
                    <h2>Ajouter votre témoignage</h2>
                    <form onSubmit={handleSubmit}>
                        <input type="text" placeholder="Nom" value={newMessage.name} onChange={(e) => setNewMessage({ ...newMessage, name: e.target.value })} required />
                        <input type="email" placeholder="Email" value={newMessage.email} onChange={(e) => setNewMessage({ ...newMessage, email: e.target.value })} required />
                        <textarea placeholder="Votre message" value={newMessage.message} onChange={(e) => setNewMessage({ ...newMessage, message: e.target.value })} required></textarea>

                        <div className="stars-selector">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span key={star} className={star <= newMessage.rating ? "selected-star" : ""} onClick={() => handleStarClick(star)}>
                                    ★
                                </span>
                            ))}
                        </div>

                        <button type="submit">Envoyer</button>
                    </form>
                </section>
            </main>
        </div>
    );
};

export const Footer = () => {
    return (
        <footer className="footer">
            <p>&copy; 2025 TodoMercado. Tous droits réservés.</p> 
        </footer>
    );
};

export default Acceuil;

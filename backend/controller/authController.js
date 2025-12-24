import User from "../model/userModel.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
    const { cin, nom, telephone, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email }) || await User.findOne({ telephone });
        if (existingUser) {
            return res.status(400).json({ message: 'L\'email ou le téléphone est déjà utilisé' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ cin, nom, telephone, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'Utilisateur créé avec succès' });
    } catch (error) {
        console.error("Erreur lors de l'inscription :", error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({
            user: {
                id: user._id,
                cin: user.cin,
                nom: user.nom,
                telephone: user.telephone,
                email: user.email,
            },
            token,
        });
    } catch (error) {
        console.error("Erreur lors de la connexion :", error.message);
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};
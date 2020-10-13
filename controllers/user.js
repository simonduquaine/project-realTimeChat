const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user');

exports.signup = (req, res, next) => {
        console.log(req.body);
        bcrypt.hash(req.body.password, 10)
                .then(hash => {
                        const user = new userModel({
                                username: req.body.username,
                                password: hash
                        });
                        user.save()
                                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                                .catch(error => res.status(400).json({ error }));
                })
                .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
        userModel.findOne({ username: req.body.username })
                .then(user => {
                        if (!user) {
                                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
                        }
                        bcrypt.compare(req.body.password, user.password)
                                .then(valid => {
                                        if (!valid) {
                                                return res.status(401).json({ error: 'Mot de passe incorrect !' });
                                        }
                                        const token = jwt.sign(
                                                { userId: user._id, userName: user.username },
                                                'RANDOM_TOKEN_SECRET',
                                                { expiresIn: '24h' }
                                        )
                                        res.status(200).json({
                                                userName: user.username,
                                                userId: user._id,
                                                token: token
                                                
                                        });
                                })
                                .catch(error => res.status(500).json({ error: 'Erreur 1' }));
                })
                .catch(error => res.status(500).json({ error2: 'Erreur 2' }));
};
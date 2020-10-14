const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user');

exports.signup = (req, res, next) => {
        bcrypt.hash(req.body.password, 10)
                .then(hash => {
                        const user = new userModel({
                                username: req.body.username,
                                password: hash
                        });
                        user.save()
                                .then(() => res.status(201).redirect('/'))
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
                                        res.status(200).redirect('/chat')

                                })
                                .catch(error => res.status(500).json({ error: 'Erreur 1' }));
                })
                .catch(error => res.status(500).json({ error2: 'Erreur 2' }));
};
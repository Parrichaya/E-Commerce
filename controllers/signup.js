const User = require("../models/user");
const Cart = require("../models/cart");

const bcrypt = require('bcrypt');

exports.addUser = (req, res, next) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    
    bcrypt.hash(password, 10, (err, hash) => {
        if(err) {
            return res.status(500).json({
                error: err
            });
        }
        
        User.create({
            username: username,
            email: email,
            password: hash
        })
        .then((newUser) => {
            return Cart.create({ shopUserId: newUser.id }) 
                .then(cart => {
                    console.log('User and cart added!');
                    res.status(201).json({ message: "User and cart added!" });
                });
        })
        .catch((err) => {
            if(err.name === "SequelizeUniqueConstraintError") {
                res.status(409).json({message: "User already exists!"});
            } else {
                console.log(err);
                res.status(500).json({error: err});
            }
        })
    })
}
const fs = require('fs');
const path = require('path');
const productsFilePath = path.join(__dirname, '../data/products.json');
//const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
const db = require('../database/models');
const sequelize = db.sequelize;
const { Op } = require("sequelize");


const Product = db.Product;
const User = db.User;
const Rol = db.Rol;
const Category = db.Category;
const ProductUser = db.ProductUser


const mainController = {
    index: (req, res) => {
        /*LISTAR LOS PRODUCTOS*/
        db.Product.findAll({
                order: [
                    ['name', 'ASC']
                ]
            })
            .then(products => {
                if (req.session.form) {
                    let data = req.session.form
                    res.render("index", { data: data, products });
                }
                res.render("index", { products })
            })
            db.User.findByPk(req.params.id)
            .then(user=> {
                res.render('index', {
                    user
                })
            })
    },


    admin: (req, res) => {
        res.send("Hola admin " + req.query.user)
    }
}

module.exports = mainController
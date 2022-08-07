const fs = require('fs');
const path = require('path');
const usersFilePath = path.join(__dirname, '../data/users.json');
//const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const ModelUsers = require('../models/User');
const db = require('../database/models/index');

const User = db.User;

const userController = {
    index: (req, res) => {


        res.render("index", { products })
    },

    login: (req, res) => {
        res.render("login")
        if (req.session.form.remember_password == 'on') {
            res.cookie('email', req.body.email, { maxAge: (1000 * 1000) * 90 })
            const email = req.session.form.email
            res.render("login", { email: email })

        }
    },

    register: (req, res) => {
        res.render("register")

    },

    store: (req, res) => {
        const resultValidation = validationResult(req)

        if (resultValidation.errors.length > 0) {
            console.log(resultValidation.errors)
            res.render("register", {
                errors: resultValidation.mapped(),
            })
        } else {
            console.log('aqui22')
            let image


            if (req.files[0] != undefined) {
                image = req.files[0].filename
            } else {
                image = "default-image.png"
            }
            /********************************************************** */


            db.User.create({
                    ...req.body,
                    password: bcrypt.hashSync('password', 10),
                })
                .then(() =>
                    res.redirect('/register')

                )
        }




    },
    user: (req, res) => {
        const resultValidation = validationResult(req)

        if (resultValidation.errors.length > 0) {
            res.render("register", {
                errors: resultValidation.mapped(),
            })
        }
    },

    userLogin: (req, res) => {

        let resultValidation = validationResult(req)
        let userToLogin = ModelUsers.findField('email', req.body.email);

        if (!resultValidation.errors.length > 0) {
            if (userToLogin) {
                //REVISAR
                // let password = req.body.password == userToLogin.password;
                let password = req.body.password;
                if (password) {
                    //REVISAR
                    // userData = userToLogin
                    // delete userToLogin.password;
                    // req.session.userLogged = userData;

                    if (req.body.remember) {
                        res.cookie('userEmail', req.body.email, { maxAge: (1000 * 1000) * 90 })
                    }

                    return res.redirect('/');
                }
                return res.render('login', {
                    errors: {
                        email: {
                            msg: 'Los datos ingresados son incorrectos'
                        }
                    }
                });
            } else {
                return res.render('login', {
                    errors: {
                        email: {
                            msg: 'No se encontro el correo ingresado'
                        }
                    }
                })
            }
        } else {

            return res.render('login', {
                errors: resultValidation.mapped(),
            })
        }

    },

    logout: (req, res) => {
        res.clearCookie('email');
        req.session.destroy();
        return res.redirect('/');
    },

    userDetail: (req, res) => {
        // console.log("entre aca")
        // db.User.findByPk(req.params.id)

        //     .then(user => {
        //         res.render('userDetail', {
        //             user,
        //             toThousand
        //         })
        //     })
        console.log("entre aca")
        db.User.findByPk(req.params.id)
            .then(user=> {
                res.render('header', {
                    user
                })
            })
    },

    edit: (req, res) => {

        let id = req.params.id;

        let promUser = User.findByPk(id)
        Promise
            .all([promUser])
            .then(([User]) => {
                res.render("editUser", { User })
            })

    },

    update: (req, res) => {

        let id = req.params.id;
        User.update({...req.body }, {
            where: {
                id: id
            }
        }).then(() => {
            res.redirect('/');
        }).catch(err => { res.send(err) });


    },

    destroy: (req, res) => {
        let userId = req.params.id;

        User.destroy({
            where: {
                id: +userId
            }
        }).then(() => {
            res.redirect('/')
        }).catch(err => res.send(err))
    },

}

module.exports = userController
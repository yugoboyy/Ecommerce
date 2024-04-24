const { Account, Order, Product, User } = require('../models')

class Controller {

    static async home(req, res) {
        try {
            res.render('Home')
        } catch (error) {
            res.send(error)
            console.log(error)
        }
    }

    static async getRegister(req, res) {
        try {
            res.render('Register')
        } catch (error) {
            res.send(error)
            console.log(error)
        }
    }

    static async postRegister(req, res) {
        try {
            let { name, dateOfBirth, gender, email, password, role } = req.body
            let addUser = await User.create({ email, password, role })
            let addAccount = await Account.create({ name, dateOfBirth, gender, UserId: addUser.id })
            res.redirect(`/login?success=${addAccount.name}`)
        } catch (error) {
            res.send(error)
            console.log(error)
        }
    }

    static async getLogin(req, res) {
        try {
            let { success } = req.query
            res.render('Login', { success })
        } catch (error) {
            res.send(error)
            console.log(error)
        }
    }

    static async showProduct(req, res) {
        try {
            let allProduct = await Product.findAll()
            res.render('Product', { allProduct })
        } catch (error) {
            res.send(error)
            console.log(error)
        }
    }
}

module.exports = Controller
const { Account, Order, Product, User } = require('../models')
const bcrypt = require('bcryptjs');
const formatRupiah = require('../helper/formatRupiah');
const { Op } = require('sequelize');

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
            let { errors } = req.query
            if (errors) {
                errors = errors.split(",")
            }
            res.render('Register', { errors })
        } catch (error) {
            res.send(error)
            console.log(error)
        }
    }

    static async postRegister(req, res) {
        try {
            let { name, dateOfBirth, gender, email, password, role } = req.body
            let addUser = await User.create({ email, password, role })
            res.redirect(`/login?success=${addUser.email}`)
        } catch (error) {
            if (error.name == 'SequelizeValidationError') {
                let err = error.errors.map((e) => {
                    return e.message
                })
                res.redirect(`/registration?errors=${err}`)
            } else if (error.name == 'SequelizeUniqueConstraintError') {
                res.redirect(`/registration?errors=${error.errors[0].message}`)
            } else {
                res.send(error)
                console.log(error)
            }
        }
    }

    static async getLogin(req, res) {
        try {
            let { success, errors } = req.query
            res.render('Login', { success, errors })
        } catch (error) {
            res.send(error)
            console.log(error)
        }
    }

    static async postLogin(req, res) {
        try {
            let { email, password } = req.body
            if (!email || !password) {
                let err = 'Invalid email or password'
                res.redirect(`/login?errors=${err}`)
            } else {
                let findOneUser = await User.findOne({
                    where: {
                        email
                    }
                })
                if (findOneUser) {
                    const isValidPassword = bcrypt.compareSync(password, findOneUser.password)
                    if (isValidPassword) {
                        req.session.userId = findOneUser.id
                        req.session.role = findOneUser.role
                        res.redirect('/')
                    } else {
                        let err = 'Invalid email or password'
                        res.redirect(`/login?errors=${err}`)
                    }
                } else {
                    let err = 'Invalid email or password'
                    res.redirect(`/login?errors=${err}`)
                }
            }
        } catch (error) {
            res.send(error)
            console.log(error)
        }
    }

    static async logout(req, res) {
        try {
            req.session.destroy((err) => {
                if (err) res.send(err)
                else res.redirect('/login')
            })
        } catch (error) {
            res.send(error)
            console.log(error)
        }
    }

    static async showProduct(req, res) {
        try {
            let { role, userId } = req.session
            let { fillter } = req.query
            let option = {
                order: [['name', 'ASC']],
            }

            let optionSellerProduct = {
                where: {
                    id: userId,
                    role: 'Seller'
                },
                include: {
                    model: Product
                },
                order: [[Product, 'name', 'ASC']]
            }

            if(fillter){
                option.where = {
                    name: {
                        [Op.iLike]: `%${fillter}%`
                    }
                }

                optionSellerProduct.include.where = {
                    name: {
                        [Op.iLike]: `%${fillter}%`
                    }
                }
            }

            let findOneAccountDetail = await Account.findOne({
                where: {
                    UserId: userId
                }
            })
            // res.send(sellerProduct)
            let allProduct = await Product.findAll(option)
            let sellerProduct = await User.findAll(optionSellerProduct)
            res.render('Product', { allProduct, role, findOneAccountDetail, formatRupiah, sellerProduct, userId })
        } catch (error) {
            res.send(error)
            console.log(error)
        }
    }

    static async getAccountDetail(req, res) {
        try {
            let { userId } = req.session
            let { errors } = req.query
            if (errors) {
                errors = errors.split(',')
            }
            let findOneAccountDetail = await Account.findOne({
                where: {
                    UserId: userId
                }
            })
            if (!findOneAccountDetail) res.render('AddAccountDetail', { errors })
            if (findOneAccountDetail) res.render('EditAccountDetail', { findOneAccountDetail, errors })
        } catch (error) {
            res.send(error)
            console.log(error)
        }
    }

    static async postAddAccountDetail(req, res) {
        try {
            let { userId } = req.session
            let { name, dateOfBirth, gender } = req.body
            await Account.create({ name, dateOfBirth, gender, UserId: userId })
            res.redirect('/')
        } catch (error) {
            if (error.name == 'SequelizeValidationError') {
                let err = error.errors.map((e) => {
                    return e.message
                })
                res.redirect(`/accountDetail?errors=${err}`)
            } else {
                res.send(error)
                console.log(error)
            }
        }
    }

    static async postEditAccountDetail(req, res) {
        try {
            let { userId } = req.session
            let { name, dateOfBirth, gender } = req.body
            await Account.update({ name, dateOfBirth, gender, UserId: userId }, {
                where: {
                    UserId: userId
                }
            })
            res.redirect('/')
        } catch (error) {
            if (error.name == 'SequelizeValidationError') {
                let err = error.errors.map((e) => {
                    return e.message
                })
                res.redirect(`/accountDetail?errors=${err}`)
            } else {
                res.send(error)
                console.log(error)
            }
        }
    }

    static async getAddProduct(req, res) {
        try {
            let { UserId } = req.params
            let { errors } = req.query
            if (errors) {
                errors = errors.split(',')
            }
            res.render('AddProduct', { UserId, errors })
        } catch (error) {
            res.send(error)
            console.log(error)
        }
    }

    static async postAddProduct(req, res) {
        try {
            let { UserId } = req.params
            let { name, stock, price } = req.body
            let addProduct = await Product.create({ name, stock, price })
            await Order.create({ UserId, name, quantity: stock, ProductId: addProduct.id, amount: price })
            res.redirect('/')
        } catch (error) {
            let { UserId } = req.params
            if (error.name == 'SequelizeValidationError') {
                let err = error.errors.map((e) => {
                    return e.message
                })
                res.redirect(`/addProduct/${UserId}?errors=${err}`)
            } else {
                res.send(error)
                console.log(error)
            }
        }
    }

    static async deleteProduct(req, res) {
        try {
            let { id } = req.params
            await Product.destroy({
                where: {
                    id
                }
            })
            res.redirect('/')
        } catch (error) {
            res.send(error)
            console.log(error)
        }
    }

    static async getAddStock(req, res) {
        try {
            let { id, UserId } = req.params
            let { error } = req.query
            let findOneProduct = await Product.findByPk(id)
            res.render('AddStock', { findOneProduct, UserId, error, formatRupiah })
        } catch (error) {
            res.send(error)
            console.log(error)
        }
    }

    static async postAddStock(req, res) {
        try {
            let { id, UserId } = req.params
            let { stock } = req.body
            if (!stock) {
                res.redirect(`/addStock/${id}/${UserId}?error=Stock is require`)
            } else {
                let findOneProduct = await Product.findByPk(id)
                await Product.increment('stock', {
                    by: stock,
                    where: {
                        id
                    }
                })
                await Order.create({
                    name: findOneProduct.name,
                    ProductId: id,
                    UserId,
                    quantity: stock,
                    amount: findOneProduct.price
                })
                res.redirect('/')
            }
        } catch (error) {
            res.send(error)
            console.log(error)
        }
    }

    static async showInventory(req, res) {
        try {
            let { id } = req.params
            let data = await Order.findAll({
                where: {
                    ProductId: id
                },
                include: Product
            })
            // res.send(data)
            res.render('Inventory', { data, formatRupiah })
        } catch (error) {
            res.send(error)
            console.log(error)
        }
    }

    static async getOrderList(req, res) {
        try {
            let { id } = req.params
            let userOrderList = await Order.findAll({
                where: {
                    UserId: id
                },
                order: [['name', 'ASC']],
                include: Product
            })
            // res.send(userOrderList)
            res.render('OrderList', { userOrderList, formatRupiah })
        } catch (error) {
            res.send(error)
            console.log(error)
        }
    }

    static async getOrderForm(req, res) {
        try {
            let { id } = req.params
            let { error, errors } = req.query
            if (errors) {
                errors = errors.split(',')
            }
            let findOneProduct = await Product.findByPk(id)
            res.render('OrderForm', { findOneProduct, error, errors })
        } catch (error) {
            res.send(error)
            console.log(error)
        }
    }

    static async postOrderForm(req, res) {
        try {
            let { address, quantity } = req.body
            let { id } = req.params
            let { userId } = req.session
            let findOneProduct = await Product.findByPk(id)
            if (quantity > findOneProduct.stock) {
                res.redirect(`/orderform/${id}?error=Quantity maximum ${findOneProduct.stock}`)
            } else if (!address) {
                res.redirect(`/orderform/${id}?error=Address is required`)
            } else {
                await Order.create({
                    name: findOneProduct.name,
                    ProductId: id,
                    UserId: userId,
                    amount: findOneProduct.price,
                    quantity: quantity,
                    address
                })
                await Product.decrement('stock', {
                    by: quantity,
                    where: {
                        id
                    }
                })
                res.redirect('/')
            }
        } catch (error) {
            let { id } = req.params
            if (error.name == 'SequelizeValidationError') {
                let err = error.errors.map((e) => {
                    return e.message
                })
                res.redirect(`/orderform/${id}?errors=${err}`)
            } else {
                res.send(error)
                console.log(error)
            }
        }
    }


}

module.exports = Controller
const Controller = require('../controllers/controller')
const router = require('express').Router()

router.get('/home', Controller.home)
router.get('/registration', Controller.getRegister)
router.post('/registration', Controller.postRegister)
router.get('/login', Controller.getLogin)
router.post('/login', Controller.postLogin)

router.use((req, res, next) => {
    if(!req.session.userId){
        let err = 'Please login first'
        res.redirect(`/login?errors=${err}`)
    }else{
        next()
    }
})

router.get('/', Controller.showProduct)
router.get('/logout', Controller.logout)
router.get('/accountDetail', Controller.getAccountDetail)
router.post('/addAccountDetail', Controller.postAddAccountDetail)
router.post('/editAccountDetail', Controller.postEditAccountDetail)
router.get('/addStock/:id/:UserId', Controller.getAddStock)
router.post('/addStock/:id/:UserId', Controller.postAddStock)
router.get('/delete/:id', Controller.deleteProduct)
router.get('/addProduct/:UserId', Controller.getAddProduct)
router.post('/addProduct/:UserId', Controller.postAddProduct)
router.get('/inventory/:id', Controller.showInventory)
router.get('/orderform/:id', Controller.getOrderForm)
router.post('/orderform/:id', Controller.postOrderForm)
router.get('/orderlist/:id', Controller.getOrderList)


module.exports = router
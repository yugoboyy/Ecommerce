const Controller = require('../controllers/controller')
const router = require('express').Router()

router.get('/home', Controller.home)
router.get('/registration', Controller.getRegister)
router.post('/registration', Controller.postRegister)
router.get('/login', Controller.getLogin)
router.get('/', Controller.showProduct)

module.exports = router
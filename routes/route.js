const Controller = require('../controllers/controller')
const router = require('express').Router()

router.get('/', Controller.home)
router.get('/registration', Controller.getRegister)
router.post('/registration', Controller.postRegister)
router.get('/login', Controller.login)

module.exports = router
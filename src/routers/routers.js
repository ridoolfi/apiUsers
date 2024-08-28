const express = require('express')
const router = express.Router()
const UsersController = require('../controllers/UsersController')
const authAdmin = require("../middlewares/authAdm")

router.post('/user',UsersController.create)
router.post('/login', UsersController.login)

router.get('/users', authAdmin, UsersController.findAll)
router.get('/user/:id',UsersController.findUser)

router.delete('/user/:id', UsersController.remove)

router.put('/user/:id', UsersController.editUser)

module.exports = router


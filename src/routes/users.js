const express = require('express')
const routes = express.Router()

const SessionController = require('../app/controllers/SessionController')
const UserController = require('../app/controllers/UserController')
const Validator = require('../app/validators/user')

//Controlador de sessão

// login/logout
// routes.get('/login', SessionController.loginForm)
// routes.post('/login', SessionController.login)
// routes.post('/logout', SessionController.logout)

// // reset password / forgot
// routes.get('/password-reset', SessionController.resetForm)
// routes.get('/forgot-password', SessionController.forgotForm)
// routes.post('/password-reset', SessionController.reset)
// routes.post('/forgot-password', SessionController.forgot)


// //Controlador de usuário
routes.get('/register', UserController.registerForm)
routes.post('/', Validator.post, UserController.post)

routes.get('/', Validator.show, UserController.show)
routes.put('/', Validator.update, UserController.update)
// routes.delete('/', UserController.delete)

module.exports = routes
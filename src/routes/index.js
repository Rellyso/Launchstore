const express = require('express')
const routes = express.Router()

const HomeController = require('../app/controllers/HomeController')

const products = require('./products')
const users = require('./users')
const cart = require('./cart')

routes.get('/', HomeController.index)

routes.use('/products', products)
routes.use('/users', users)
routes.use('/cart', cart)


//Alias
routes.get('/ads/create', (req, res) => {
    return res.redirect('/products/create')
})

routes.get('/accounts', (req, res) => {
    return res.redirect('/users/login')
})

routes.get('/products', (req, res) => {
    return res.redirect('/')
})

module.exports = routes
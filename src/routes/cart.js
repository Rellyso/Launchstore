const express = require('express')
const routes = express.Router()

const CartController = require('../app/controllers/CartController')


routes.get('/', CartController.index)
    .post('/:id/add', CartController.addOne)
    .post('/:id/remove', CartController.removeOne)
    .post('/:id/delete', CartController.delete)

module.exports = routes
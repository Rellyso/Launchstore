const express = require('express')
const routes = express.Router()
const multer = require('./app/middlewares/multer')

const ProductController = require('./app/controllers/ProductsController')
const HomeController = require('./app/controllers/HomeController')
const SearchController = require('./app/controllers/SearchController')

routes.get('/', HomeController.index)

//Controlador de pesquisa
routes.get('/products/search', SearchController.index)


//Controlador do produto
routes.get('/products', ProductController.create)
routes.get('/products/:id', ProductController.show)
routes.get('/products/:id/edit', ProductController.edit)

routes.post('/products', multer.array("photos", 6), ProductController.post)
routes.put('/products', multer.array("photos", 6), ProductController.put)
routes.delete('/products', ProductController.delete)


//Alias
routes.get('/ads/create', function (req, res) {
    return res.redirect('/products')
})

module.exports = routes
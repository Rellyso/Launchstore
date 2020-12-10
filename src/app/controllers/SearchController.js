const Product = require('../models/Product')
const LoadProductsService = require('../services/LoadServices')

const { formatPrice } = require('../../lib/utils')

module.exports = {
    async index(req, res) {
        
        try {
            let params = {}

            const { filter, category } = req.query

            if (!filter) return res.redirect('/')

            params.filter = filter

            if (category) {
                params.category = category
            }

            let products = await Product.search(params)

            const productsPromise = products.map(LoadProductsService.format)

            products = await Promise.all(productsPromise)

            const search = {
                term: req.query.filter,
                total: products.length
            }

            const categories = products.map(product => ({
                id: product.category_id,
                name: product.category_name
            })).reduce((filteredCategories, category) => {

                const found = filteredCategories.some(cat => cat.id == category.id)

                if (!found) {
                    filteredCategories.push(category)
                }
                return filteredCategories
            }, [])

            return res.render("search/index", { products, search, categories })


        } catch (err) {
            console.error(err)
        }
    }
}
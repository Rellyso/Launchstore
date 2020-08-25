const Category = require('../models/Category')
const Product = require('../models/Product')

module.exports = {
    create(req, res) {
        Category.all()
            .then(function (results) {

                const categories = results.rows

                return res.render('products/create.njk', { categories })
            }).catch((err) => {
                throw new Error(err)
            })
    },

    async post(req, res) {
        const keys = Object.keys(req.body)

        for (let key of keys) {
            // req.body.avatar_url == ""
            if (req.body[key] == "")
                return res.send('Please fill in all fields.')
        }
        
        let results = await Product.create(req.body)

        const productId = results.rows[0].id

        results = await Category.all()
        const categories = results.rows

        await res.render('products/create.njk', { productId, categories})
    },
}
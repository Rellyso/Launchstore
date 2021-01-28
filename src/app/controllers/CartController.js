const Cart = require('../../lib/cart')

const LoadProductsService = require('../services/LoadServices')

module.exports = {
    async index(req, res) {
        try {
            let { cart } = req.session

            // gerenciador do carrinho
            cart = Cart.init(cart)

            res.render('cart/index', { cart })
            
        } catch (err) {
            console.error(err)
        }
    },

    async addOne(req, res) {
        // pegar o id do produto e o produto
        const { id } = req.params 

        const product = await LoadProductsService.load('product', {where: { id }})

        // pegar o carrinho da sessão
        let { cart } = req.session

        // adicionar o produto ao carrinho (usando o gerenciador do carrinho)
        cart = Cart.init(cart).addOne(product)

        // atualizar o carrinho da sessão
        req.session.cart = cart

        // redirecionar o usuário para a tela do carrinho.
        return res.redirect('/cart')
    },

    removeOne(req, res) {
        // pegar o id do produto
        const { id } = req.params
        
        // pegar o carrinho da sessão
        let { cart } = req.session

        // se não tiver o carrinho, retornar
        if (!cart) return res.redirect('/cart')

        // iniciar o carrinho (gerenciador de carrinho)
        cart = Cart.init(cart).removeOne(id)
        
        // atualizar o carrinho da sessão removendo 1 item
        req.session.cart = cart

        // redirecionamento para a página cart
        return res.redirect('/cart')
    },

    delete(req,res) {
        const { id } = req.params
        let { cart } = req.session

        if (!cart) return 

        req.session.cart = Cart.init(cart).delete(id)

        return res.redirect('/cart')
    }
}
const { formatPrice } = require('./utils')

const Cart = {
    init(oldCart) {
        if (oldCart) {
            this.items = oldCart.items
            this.total = oldCart.total
        } else {
            this.items = []
            this.total = {
                quantity: 0,
                price: 0,
                formattedPrice: formatPrice(0),
            }
        }

        return this
    },
    addOne(product){
        // se já existe o produto no carrinho
        let inCart = this.getCartItem(product.id)

        // se não existe
        if (!inCart) {
            inCart = {
                product: {
                    ...product,
                    formattedPrice: formatPrice(product.price)
                },
                quantity: 0,
                price: 0,
                formattedPrice: formatPrice(0)
            }

            this.items.push(inCart)
        }

        // se a quantidade no carrinho for maior do que a quantidade disponível do produto  
        if (inCart.quantity >= product.quantity) return this

        // atualiza item
        inCart.quantity++
        inCart.price = inCart.product.price * inCart.quantity
        inCart.formattedPrice = formatPrice(inCart.price)

        // atualiza carrinho
        this.total.quantity++
        this.total.price += inCart.product.price
        this.total.formattedPrice = formatPrice(this.total.price)

        return this
    },
    removeOne(productId){
        // pega o produto a ser removido a partir do id e coloca na variável inCart
        let inCart = this.getCartItem(productId)

        // se não existir o produto com o id a ser removido, retorna o carrinho sem alterações
        if (!inCart) return this

        // se existir o id, remover produto:
        inCart.quantity--
        inCart.price = inCart.product.price * inCart.quantity
        inCart.formattedPrice = formatPrice(inCart.price)

        // e remover do total do carrinho:
        this.total.quantity--
        this.total.price -= inCart.product.price
        this.total.formattedPrice = formatPrice(this.total.price)

        // se quantidade for igual a zero
        if (inCart.quantity < 1) {
            // const itemIndex = this.items.indexOf(inCart)
            // this.items.splice(itemIndex, 1)
            // return this

            // traz todos os itens que não são de id's iguais 
            this.items = this.items.filter(item => 
                item.product.id != inCart.product.id)
            return this
        }

        return this
        
    },
    delete(productId){
        let inCart = this.getCartItem(productId)

        if (!inCart) return this

        if (this.items.length > 0) {
            this.total.quantity -= inCart.quantity 
            this.total.price -= (inCart.product.price * inCart.quantity) 
            this.total.formattedPrice = formatPrice(this.total.price)
        }

        this.items = this.items.filter(item => 
            item.product.id != inCart.product.id)

        return this
    },
    getCartItem(productId) {
        return this.items.find(item => item.product.id == productId)
    }
}

module.exports = Cart
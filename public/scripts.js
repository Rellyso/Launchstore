const inputPrice = document.querySelector('input[name="price"]')

inputPrice.addEventListener("keydown", (e) => {
    setTimeout(() => {
        let { value } = e.target

        value = value.replace(/\D/g, "")

        value = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value / 100)

        e.target.value = value
    }, 1)
})

const Mask = {
    apply(input, func) {
        input.value = Mask[func](input.value) // == Mask.func(value)
    },
    format(value) {
        setTimeout(() => {
            value = value.replace(/\D/g, "")
    
            return new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            }).format(value / 100)
        }, 1)
    }
}

Mask.apply(this, 'Mask.format')
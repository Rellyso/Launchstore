async function post(req, res, next) {
    const keys = Object.keys(req.body)

    for (let key of keys) {
        // req.body.avatar_url == ""
        if (req.body[key] == "" && key != "removed_files")
            return res.send('Por favor, volte e preencha todos os campos.')
    }

    if (!req.files || req.files.length == 0)
        res.render('products/create', {
            error: 'Por favor envie ao menos uma imagem.',
            product: req.body,
            categories: (await Category.all()).rows
        })

    next()
}

async function put(req, res, next) {
    const keys = Object.keys(req.body)
    
    for (let key of keys) {
        if (req.body[key] == "" && key != "removed_files")
            return res.send('Por favor, volte e preencha todos os campos.')
    }
    
    next()
}

module.exports = {
    post,
    put,
}
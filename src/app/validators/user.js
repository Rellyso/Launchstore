const User = require('../models/User')

async function post(req, res, next) {
    const keys = Object.keys(req.body)

        // verify 

        // if was filled in all fields
        for (let key of keys) {
            if (req.body[key] == "") {
                return res.render('users/register', {
                    user: req.body,
                    error: 'Por favor preencha todos os campos.'
                })
            }
        }

        // if user exists [email, cpf_cnpj]
        let { email, cpf_cnpj, password, passwordRepeat } = req.body

        cpf_cnpj = cpf_cnpj.replace(/\D/g, "")

        const user = await User.findOne({ 
            where: { email },
            or: { cpf_cnpj }
        })

        if (user) return res.render('users/register', {
                user: req.body,
                error: 'Usuário já cadastrado.'
        })

        if (password != passwordRepeat) {
            return res.render('users/register', {
                user: req.body,
                error: 'Senhas não correspondem.'
            })
        }

    next()
}

module.exports = {
    post
}
const User = require('../models/User')
const { compare } = require('bcryptjs')

function checkAllFields(body) {
    const keys = Object.keys(body)

    for (let key of keys) {
        if (body[key] == "") {
            return {
                user: body,
                error: 'Por favor preencha todos os campos.'
            }
        }
    }
}


async function post(req, res, next) {
    // if was filled in all fields
    const fillAllFields = checkAllFields(req.body)

    if (fillAllFields) return res.render('user/register', fillAllFields)

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
async function show(req, res, next) {
    const { userId: id } = req.session

    const user = await User.findOne({ where: { id } })

    if (!user) return res.render('users/register', {
        error: 'Usuário não encontrado'
    })

    req.user = user

    next()
}
async function update(req, res, next) {
    // check if filled all fields

    const fillAllFields = checkAllFields(req.body)

    if (fillAllFields) return res.render('users/index', fillAllFields)
    
    // has password

    const { id, password } = req.body

    if (!password) {
        return res.render('users/index', {
            user: req.body,
            error: 'É necessário sua senha para atualizar o cadastro.'
        })
    } 
    
    // password match
    const user = await User.findOne({where: {id}})

    const passed = await compare(password, user.password)

    if (!passed) return res.render('users/index', {
        user: req.body,
        error: 'Senha incorreta.'
    })

    req.user = user

    next()
}

module.exports = {
    post,
    show,
    update
}
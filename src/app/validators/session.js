const User = require('../models/User')
const { compare } = require('bcryptjs')


async function login(req, res, next) {

    // verificar se o usuário existe
    // verify if user exists
    const { email, password } = req.body

    const user = await User.findOne({ where: { email } })

    if (!user) return res.render('session/login', {
        user: req.body,
        error: 'Usuário não cadastrado!'
    })

    // verificar se as senhas batem
    // verify if password match
    let passed = false

    if (user.password.length > 8) {
        passed = await compare(password, user.password)
    } else {
        // VERIFICAÇÃO PARA TESTES DE DESENVOLVIMENTO APENAS
        passed = password == user.password
    }

    if (!passed) return res.render('session/login', {
        user: req.body,
        error: 'Senha incorreta.'
    })

    req.user = user

    next()
}

async function forgot(req, res, next) {
    const { email } = req.body

    try {
        let user = await User.findOne({ where: { email } })

        if (!user) return res.render('session/forgot-password', {
            user: req.body,
            error: 'Usuário não cadastrado.'
        })

        req.user = user

        next()
    } catch (err) {
        console.error(err)
    }
}

async function reset(req, res, next) {
    // procurar o usuário
    const { email, password, passwordRepeat, token } = req.body

    const user = await User.findOne({ where: { email } })

    if (!user) return res.render('session/password-reset', {
        user: req.body,
        token,
        error: 'Usuário não cadastrado!'
    })

    // verificar se as senhas batem
    if (password != passwordRepeat) return res.render('session/password-reset', {
            user: req.body,
            token,
            error: 'Senhas não correspondem.'
        })

    // verificar se o token bate
    if (token != user.reset_token) return res.render('session/password-reset', {
            user: req.body,
            token,
            error: 'Token inválido! Solicite uma nova recuperação de senha.'
        })


    // verificar se o token não expirou
    let now = new Date()
    now = now.setHours(now.getHours())

    if (now > user.reset_token_expires) return res.render('session/password-reset', {
        user: req.body,
        token,
        error: 'Token expirado! Por favor, solicite uma nova recuperação de senha.'
    })

    req.user = user
    
    next()
}

module.exports = {
    login,
    forgot,
    reset,
}
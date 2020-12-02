const User = require('../models/User')
const crypto = require('crypto')
const mailer = require('../../lib/mailer')

const { hash } = require('bcryptjs')

module.exports = {
    loginForm(req, res) {
        return res.render("session/login")
    },
    login(req, res) {
        // colocar o usuário no req.session 
        req.session.userId = req.user.id

        return res.redirect('/users')
    },
    logout(req, res) {
        req.session.destroy()

        return res.redirect('/')
    },
    forgotForm(req, res) {
        return res.render("session/forgot-password")
    },
    async forgot(req, res) {
        try {
            const { user } = req

            // criar um token para o usuário 
            const token = crypto.randomBytes(20).toString('hex')

            // criar uma expiração
            let now = new Date()
            now = now.setHours(now.getHours() + 1)

            await User.update(user.id, {
                reset_token: token,
                reset_token_expires: now,
            })
            // enviar um email com um link de recuperação de senha
            await mailer.sendMail({
                to: user.email,
                from: 'no-reply@launchstore.com.br',
                subject: 'Recuperação de senha',
                html: `
                    <h1>Perdeu a chave?</h1>
                    <p>Não se preocupe, clique no link abaixo para recuperar sua senha</p>
                    <p>
                        <a href="http://localhost:3000/users/password-reset?token=${token}" target="_blank">
                            RECUPERAR SENHA
                        </a>
                    </p>
                `
            })

            // avisar ao usuário que enviamos um email
            return res.render("session/forgot-password", {
                success: "Verifique seu email para resetar sua senha!"
            })
        } catch (err) {
            console.error(err)
            return res.render("session/forgot-password", {
                error: "Erro inesperado! Entre em contato conosco em example@domain.com"
            })
        }
    },
    resetForm(req, res) {
        return res.render('session/password-reset', { token: req.query.token })
    },
    async reset(req, res) {
        const { user } = req
        const { password, token } = req.body

        try {

            // cria um novo hash de senha
            const newPassword = await hash(password, 8)
            
            // atualiza o usuário
            await User.update(user.id, {
                password: newPassword,
                reset_token: "",
                reset_token_expires: "",
            })

            // avisa ao usuário que tem uma nova senha
            return res.render('session/login', {
                user: req.body,
                success: "Senha atualizada! Faça o seu login",
            })
            
        } catch (err) {
            console.error(err)
            return res.render("session/password-repeat", {
                user: req.body,
                token,
                error: "Erro inesperado! Entre em contato conosco em example@domain.com"
            })
        }
    }
}
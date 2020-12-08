const { hash } = require('bcryptjs')
const { unlinkSync } = require('fs')

const User = require('../models/User')

const { formatCep, formatCpfCnpj } = require('../../lib/utils')
const Product = require('../models/Product')

module.exports = {
    registerForm(req, res) {
        return res.render("users/register")
    },

    async show(req, res) {

        try {
            const { user } = req

            user.cpf_cnpj = formatCpfCnpj(user.cpf_cnpj)
            user.cep = formatCep(user.cep)

            return res.render('users/index', { user })

        } catch (error) {
            console.error(error)
        }
    },

    async post(req, res) {
        try {
            let { name, email, password, cpf_cnpj, cep, address } = req.body

            password = await hash(password, 8)
            cpf_cnpj = cpf_cnpj.replace(/\D/g, "")
            cep = cep.replace(/\D/g, "")

            const userId = await User.create({
                name,
                email,
                password,
                cpf_cnpj,
                cep,
                address
            })

            req.session.userId = userId

            return res.redirect('/users')

        } catch (error) {
            console.error(error);
        }
    },

    async update(req, res) {
        try {
            const { user } = req
            let { name, email, cpf_cnpj, cep, address } = req.body

            cpf_cnpj = cpf_cnpj.replace(/\D/g, "")
            cep = cep.replace(/\D/g, "")


            await User.update(user.id, {
                name,
                email,
                cpf_cnpj,
                cep,
                address
            })

            return res.render('users/index', {
                user: req.body,
                success: 'Usuário atualizado com sucesso!'
            })

        } catch (err) {
            console.error(err)

            return res.render('users/index', {
                error: 'Ocorreu um erro.'
            })
        }
    },
    async delete(req, res) {
        try {
            const products = await Product.findAll({where: {id: req.body.id}})

            // Pegar todas as imagens de cada produto
            const allFilesPromise = products.map(product => Product.files(product.id))

            let promiseResults = await Promise.all(allFilesPromise)

            // remover usuário do banco de dados e destruir sessão
            await User.delete(req.body.id)
            req.session.destroy()

            // Excluir todos os arquivos da pasta public
            promiseResults.map(files => {
                files.map(file => {
                    try {
                        unlinkSync(file.path)
                    } catch (err) {
                        console.error(err)
                    }
                })
            })
            
            return res.render("session/login", {
                success: "Conta deletada com sucesso!"
            })

        } catch (err) {
            console.error(err)
            return res.render("users/index", {
                error: "Erro ao deletar sua conta"
            })
        }
    }
}
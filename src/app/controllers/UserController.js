const User = require('../models/User')

module.exports = {
    registerForm(req, res) {
        return res.render("users/register")
    },
    async post(req, res) {
        const keys = Object.keys(req.body)

        // verify 

        // if was filled in all fields
        for (let key of keys) {
            if (req.body[key] == "") {
                return res.send('Please fill in all fields.')
            }
        }

        // if user exists [email, cpf_cnpj]
        const { email, cpf_cnpj } = req.body

        const user = await User.findOne({ 
            where: { email },
            cpf_cnpj: { cpf_cnpj }
        })

        return res.send(req.body)

    }
}
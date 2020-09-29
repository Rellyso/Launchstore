class UserController {
    registerForm(req, res) {
        return res.redirect('/products')
    }
}

module.exports = new UserController
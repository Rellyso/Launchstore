const db = require('../../config/db')
const { hash } = require('bcryptjs')
const fs = require('fs')

const Product = require('./Product')
const Base = require('./Base')

Base.init({ table: 'users' })

module.exports = {
    ...Base,
    // async create(data) {

    //     try {
    //         const query = ` 
    //         INSERT INTO users (
    //             name,
    //             email,
    //             password,
    //             cpf_cnpj,
    //             cep,
    //             address
    //         ) VALUES ($1, $2, $3, $4, $5, $6)
    //         RETURNING id
    //     `
    //         // password hash
    //         const passwordHash = await hash(data.password, 8)

    //         const values = [
    //             data.name,
    //             data.email,
    //             passwordHash,
    //             data.cpf_cnpj.replace(/\D/g, ""),
    //             data.cep.replace(/\D/g, ""),
    //             data.address,
    //         ]

    //         const results = await db.query(query, values)
    //         return results.rows[0].id
    //     } catch (err) {
    //         console.error(err)
    //     }
    // },
    
    async update(id, fields) {
        let query = `UPDATE users SET`

        Object.keys(fields).map((key, index, array) => {
            if ((index + 1) < array.length) {
                // if not last key

                query = ` ${query}
                    ${key} = '${fields[key]}',
                `
            } else {
                // if last key
                query = ` ${query}
                    ${key} = '${fields[key]}'
                    WHERE id = ${id}
                `
            }
        })

        await db.query(query)

        return
    },
    
    async delete(id) {
        try {
            // Pegar todos os produtos do usuário
            let results = await db.query("SELECT * FROM products WHERE user_id = $1", [id])
            const products = results.rows

            // Pegar todas as imagens de cada produto
            const allFilesPromise = products.map(product => Product.files(product.id))

            let promiseResults = await Promise.all(allFilesPromise)

            // Deletar o usuário do bd
            await db.query('DELETE FROM users WHERE id = $1', [id])

            // Excluir todos os arquivos da pasta public
            promiseResults.map(results => {
                results.rows.map(file => {
                    try {
                        fs.unlinkSync(file.path)
                    } catch (err) {
                        console.error(err)
                    }
                })
            })
        } catch (err) {
            console.error(err)
        }
    }
}
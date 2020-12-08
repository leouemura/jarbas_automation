const connection = require('../database/connection');
const crypto = require('crypto');

module.exports = {
    async create(req,res){
        const {
            username,
            email,
            password
        } = req.body;

        const id = crypto.randomBytes(4).toString('HEX');
        //verificar existencia de usuario OU email ja cadastrado
        let duplicated = await connection('users').select('username','email').where('username', username).orWhere('email',email);
        if(duplicated.length!=0){
            return res.json({message: `${duplicated[0].username} já cadastrou-se com o email ${duplicated[0].email}`})
        }
        else{
            await connection('users').insert({ id, username, email, password });
            return res.json({id, username, email, password})
        }
    },

    //TODO - update users

    async index(req,res){
        const all_users = await connection('users').select('*');
        return res.json({ all_users })
    },

    async delete(req,res){
        await connection('users').delete();
        return res.json("TODOS OS DADOS DELETADOS")
    }
}
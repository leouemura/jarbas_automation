// EXEMPLO DE CONTROLLER
const connection = require('../database/connection');
const crypto = require('crypto');

module.exports = {
    async create(req,res){
        const {
            username,
            password
        } = req.body;

        const id = crypto.randomBytes(4).toString('HEX');

        await connection('db_tablename').insert({ id, username, password });
        return res.json({id, username, password})
    },

    async index(req,res){
        const all_users = await connection('db_tablename').select('*');
        return res.json({ all_users })
    },

    async delete(req,res){
        await connection('db_tablename').delete();
        return res.json("TODOS OS DADOS DELETADOS")
    }
}
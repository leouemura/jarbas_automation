const connection = require('../database/connection');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

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
            const hash = crypto.createHash('md5').update(password).digest('hex');
            const token = jwt.sign({id}, 'jsonwebtokensecret123456789-yudi', {expiresIn:3600})

            await connection('users').insert({ id, username, email, password: hash });
            return res.send({user:{id, username, email, password: hash}, token:{token}})
        }
    },

    //TODO - update users

    async index(req,res){
        const [,token] = req.headers.authorization.split(' ')
        //console.log(req.headers.authorization)
        try{
            const payload = jwt.verify(token, 'jsonwebtokensecret123456789-yudi')
            const user_id = await connection('users').select('*').where('id', payload.id[0].id)
    
            if(!user_id){
                return res.send(401)
            }

        }catch(error){
            res.send(401, error)
        }
        
        //se o token for valido libera pra visualizar todos os usuarioss
        const all_users = await connection('users').select('*');
        return res.json({ all_users })
    },

    async delete(req,res){
        await connection('users').delete();
        return res.json("TODOS OS DADOS DELETADOS")
    },

    
}
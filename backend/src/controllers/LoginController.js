const connection = require('../database/connection');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

module.exports={
    async create(req,res){
        
        /*
        const {
            username_email,
            password
        } = req.body
        */
        const [, hash] = req.headers.authorization.split(' ')
        const [username_email, password] = Buffer.from(hash,'base64').toString().split(":")
        console.log(username_email)
        const passwordDecrypt = crypto.createHash('md5').update(password).digest('hex');

        const passUsername = await connection('users').select('username').where('username',username_email).andWhere('password', passwordDecrypt)
        const passEmail = await connection('users').select('username').where('email',username_email).andWhere('password', passwordDecrypt)
        
        if((passUsername.length!=0)||(passEmail.length!=0)){
            if(passUsername.length!=0){
                let user_id = await connection('users').select('id').where('username',passUsername[0].username)
                const token = jwt.sign({id:user_id}, 'jsonwebtokensecret123456789-yudi', {expiresIn:3600})
                return res.json({token})
            }
            if(passEmail.length!=0){
                let user_id = await connection('users').select('id').where('username',passEmail[0].username)
                const token = jwt.sign({id:user_id}, 'jsonwebtokensecret123456789-yudi', {expiresIn:3600})
                return res.json({token})
            }
        }
        else{
            return res.status(404).send({error: "Usuario não encontrado"})
        }
        
    },

    async me(req,res){
        const [,token] = req.headers.authorization.split(' ')
        //console.log(req.headers.authorization)
        try{
            const payload = jwt.verify(token, 'jsonwebtokensecret123456789-yudi')
            //console.log(payload)
            const user_id = await connection('users').select('*').where('id', payload.id[0].id)
    
            if(!user_id){
                return res.send(401)
            }
            console.log(user_id)
            return res.send({user_id})

        }catch(error){
            res.send(401, error)
        }
    }
}
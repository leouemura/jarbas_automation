const connection = require('../database/connection');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

module.exports = {
    async create(req,res){
        const {
            hour,
            minute,
            frequency,
            token
        } = req.body;
        const id = crypto.randomBytes(4).toString('HEX');
        //pega id do usuario
        const userVerified = []
        const payload = jwt.verify(token, 'jsonwebtokensecret123456789-yudi')
        const user_id = await connection('users').select('*').where('id', payload.id[0].id)
        
        if(!user_id){
            return res.send(401)
        }
        
        userVerified.push(user_id[0].id)
        
        if(userVerified.length==0){
            res.send(401)
        }
        //coloca array frequency em ordem numerica crescente
        let frequencyOrdered = frequency.sort()
        //console.log(frequencyOrdered)

        //verifica existencia de alarme com tempo e mesma frequencia ja cadastrado
        //IMPLEMENTAÇÃO FUTURA: adicionar dispositivo que ira tocar o alarme
        let duplicated = await connection('alarms').select('hour','minute','frequency').where('user_id', userVerified[0]).andWhere('hour',hour).andWhere('minute',minute).andWhere('frequency',frequencyOrdered)
        if(duplicated.length!=0){
            return res.json({message: `Alarme com mesmo horario e periodicidade ja cadastrados anteriormente...`})
        }
        else{
            await connection('alarms').insert({ id, hour, minute, frequency:frequencyOrdered, user_id: userVerified[0] });
            return res.json({id, hour, minute, frequency:frequencyOrdered, user_id: userVerified[0]})
        }
    },

    //TODO - update users

    async index(req,res){
        const [,token] = req.headers.authorization.split(' ')
        const userVerified = []
        try{
            const payload = jwt.verify(token, 'jsonwebtokensecret123456789-yudi')
            //console.log(payload)
            const user_id = await connection('users').select('*').where('id', payload.id[0].id)
    
            if(!user_id){
                return res.send(401)
            }
            //console.log(user_id)
            userVerified.push(user_id[0].id)

        }catch(error){
            res.send(401, error)
        }

        const all_user_alarms = await connection('alarms').select('*').where('user_id', userVerified[0])
        return res.json({ all_user_alarms })
    },

    async delete(req,res){
        await connection('alarms').delete();
        return res.json("TODOS OS DADOS DELETADOS")
    }
}
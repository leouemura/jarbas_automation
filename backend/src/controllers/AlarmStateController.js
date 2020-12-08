const connection = require('../database/connection');
const jwt = require('jsonwebtoken');
const { create } = require('./UserController');
const e = require('express');

module.exports = {
    async update(req,res){
        const {
            id,
            state,
            token
        } = req.body

            const userVerified = []
            try{
                const payload = jwt.verify(token, 'jsonwebtokensecret123456789-yudi')
                const user_id = await connection('users').select('*').where('id', payload.id[0].id)
                
                if(!user_id){
                    return res.send(401)
                }
                
                userVerified.push(user_id[0].id)
                
                if(userVerified.length==0){
                    res.send(401)
                }
            }
            catch(error){
                return res.send({error})
            }

        const previousState = await connection('alarmstates').select('state').where('id',id)
        if(previousState.length!=0){
            if(state === 'ON'){
                await connection('alarmstates').where('id',id).update('state',state)
                return res.send({message: "Alarme ligado com sucesso"})
            }
            if(state === 'OFF'){
                await connection('alarmstates').where('id',id).update('state',state)
                return res.send({message: "Alarme desligado com sucesso"})
            }
            return res.send({error: "Erro no formato do estado do alarme"})
        }
        else{
            if(state === 'ON'){
                await connection('alarmstates').insert({id, state, user_id: userVerified[0]})
                return res.send({message: "Alarme ligado com sucesso"})
            }
            if(state === 'OFF'){
                await connection('alarmstates').insert({id, state, user_id: userVerified[0]})
                return res.send({message: "Alarme desligado com sucesso"})
            }
            return res.send({error: "Erro no formato do estado do alarme"})
        }
    },

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

        const all_states = await connection('alarmstates').select('*').where('user_id',userVerified[0])
        return res.send({all_states})
    }
}
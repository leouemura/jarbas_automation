const connection = require('../database/connection');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');


module.exports = {

    async create(req,res){
        const{
            macid,
            espfunction,
            house,
            token
        } = req.body

        const id = crypto.randomBytes(4).toString('HEX');

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

        let duplicated = await connection('esps').select('*').where('user_id', userVerified[0]).andWhere('macid',macid)
        
        if((duplicated.length==0)){
            //insere novo esp
            await connection('esps').insert({id, macid, espfunction, house, user_id: userVerified[0]})
            return res.json({id, macid, house, user_id: userVerified[0]})
        }
        else{
            //msm esp... bloquear solicitação
            return res.send({message: `ESP ${duplicated[0].macid} já existente`})
        }

    },

    


    async update(req,res){
        const {
            macid,
            espfunction,
            house,
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

        //verifica se o macid do esp pertence ao usuario do token
        const selectedEsp = await connection('esps').select('*').where('macid', macid).andWhere('user_id', userVerified[0])
        if(selectedEsp!=0){
            //atualiza esp
            await connection('esps').update({ espfunction, house}).where('macid', macid).andWhere('user_id', userVerified[0])
            return res.json({message:`ESP ${macid} atualizado`,data:{id:selectedEsp[0].id, macid, espfunction, house, user_id: userVerified[0]}})
        }
        else{
            return res.json({message: "Acesso de ids nao autorizados."})
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

        const all_user_esps = await connection('esps').select('*').where('user_id', userVerified[0])
        return res.json({ all_user_esps })
    },






    async delete(req,res){
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

        const mac_id = req.headers.mac_id
        await connection('esps').delete().where('user_id', userVerified[0]).andWhere('macid', mac_id)
        return res.json(`ESP COM MACID = ${mac_id} DELETADO`)
    }
}
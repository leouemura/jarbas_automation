const connection = require('../database/connection');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

module.exports = {
    //ao criar o alarme o estado é setado sempre como state = ON
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
        //coloca array frequency em ordem numerica crescente
        let frequencyOrdered = frequency.sort()
        //console.log(frequencyOrdered)
        

        //verifica existencia de alarme com tempo e mesma frequencia ja cadastrado
        //IMPLEMENTAÇÃO FUTURA: adicionar dispositivo que ira tocar o alarme
        let duplicated = await connection('frequencyalarms').select('id').where('user_id', userVerified[0]).andWhere('hour',hour).andWhere('minute',minute).andWhere('frequency',frequencyOrdered)
        if(duplicated.length!=0){
            return res.json({message: `Alarme com mesmo horario e periodicidade ja cadastrados anteriormente...`})
        }
        else{
            await connection('frequencyalarms').insert({ id, hour, minute, frequency:frequencyOrdered, state: "ON", user_id: userVerified[0] });
            for(index=0; index<frequencyOrdered.length; index++){
                const randomId = crypto.randomBytes(4).toString('HEX');
                
                await connection('dowalarms').insert({id: randomId, hour, minute, dayoftheweek: frequencyOrdered[index], state: "ON", user_id: userVerified[0], alarm_id: id })
            }
            return res.json({id, hour, minute, frequency:frequencyOrdered, user_id: userVerified[0]})
        }
    },

    //TODO - update single alarm
    async update(req,res){
        const {
            id,
            hour,
            minute,
            frequency,
            state,
            token
        } = req.body;
        //pega id do usuario
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
        //coloca array frequency em ordem numerica crescente
        let frequencyOrdered = frequency.sort()
        //console.log(frequencyOrdered)
        
        let duplicated = await connection('frequencyalarms').select('id').where('user_id', userVerified[0]).andWhere('hour',hour).andWhere('minute',minute).andWhere('frequency',frequencyOrdered)
        const alarmfrequency = await connection('frequencyalarms').select('*').where('id', id).andWhere('user_id', userVerified[0])       
        //console.log(alarmfrequency)
        if(alarmfrequency.length!=0){
            if(duplicated.length==0){
                //atualizar no alarm frequency db
                await connection('frequencyalarms').update({hour: hour, minute: minute, frequency: frequencyOrdered, state: state}).where('id',id)
                
                //deleto td no alarm dayoftheweek db para o determinado id
                await connection('dowalarms').delete().where('alarm_id',id)
    
                for(index=0; index<frequencyOrdered.length; index++){
                    const randomId = crypto.randomBytes(4).toString('HEX');
                    
                    await connection('dowalarms').insert({id: randomId, hour, minute, dayoftheweek: frequencyOrdered[index], state: state, user_id: userVerified[0], alarm_id: id })
                }
                console.log("Atualizou no campo all changes")
                return res.json({id, hour, minute, frequency,state, user_id: userVerified[0]})
                
            }
            else{
                if(id==duplicated[0].id){
                    //TODOS OS DADOS IGUAIS
                    //verificar se há mudança no estado do alarme
                    alarmfr_state = await connection('frequencyalarms').select('state').where('id',id)
                    if(alarmfr_state[0].state == state){
                        return res.json({message: `Nenhuma alteração foi feita...`})
                    }
                    else{
                        await connection('frequencyalarms').update({hour: hour, minute: minute, frequency: frequencyOrdered, state: state}).where('id',id)
    
                        await connection('dowalarms').delete().where('alarm_id',id)
    
                        for(index=0; index<frequencyOrdered.length; index++){
                            const randomId = crypto.randomBytes(4).toString('HEX');
                            
                            await connection('dowalarms').insert({id: randomId, hour, minute, dayoftheweek: frequencyOrdered[index], state: state, user_id: userVerified[0], alarm_id: id })
                        }
                        console.log("Atualizou no campo state changes")
                        return res.json({id, hour, minute, frequency,state, user_id: userVerified[0]})
                    }
                }
                else{
                    return res.json({message: `Alarme com mesmo horario e periodicidade ja cadastrados anteriormente...`})
                }
            }
        }
        else{
            return res.json({message: `Alarme com ids nao existentes... Tente dar refresh na pagina`})
        }
    },

    async index(req,res){
        const [,token] = req.headers.authorization.split(' ')
        const userVerified = []
        try{
            console.log("ENTROOOOOOOOOOOOOOOOOOOOOOOOOOOOOOU")
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

        const all_user_alarms = await connection('frequencyalarms').select('*').where('user_id', userVerified[0])
        return res.json({ all_user_alarms })
    },

    //TODO arrumar delete pra apagar apenas o alarme requerido
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

        const alarm_id = req.headers.alarm_id
        await connection('frequencyalarms').delete().where('user_id', userVerified[0]).andWhere('id', alarm_id)
        await connection('dowalarms').delete().where('user_id', userVerified[0]).andWhere('alarm_id', alarm_id)
        return res.json(`ALARME COM ID=${alarm_id} DELETADO`)
    }
}
const connection = require('../database/connection');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

module.exports = {
    async create(req,res){
        const {
            house,
            token
        } = req.body

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
        
        let duplicated = await connection('houses').select('*').where('user_id', userVerified[0]).andWhere('house',house)
        if(duplicated.length!=0){
            //qnd o nome esta duplicado
            return res.send({message: `Casa ${duplicated[0].house} já existente`})
        }
        else{
            //qnd o nome nao esta duplicado
            const other_houses = await connection('houses').select('*').where('user_id', userVerified[0])
            if(other_houses.length==0){
                //insere nova casa
                await connection('houses').insert({id, house, state: "ON", user_id: userVerified[0]})
                return res.json({id, house, state: "ON", user_id: userVerified[0]})
            }
            else{
                //muda o estado de todas as outras casas para off
                for(index=0; index<other_houses.length; index++){
                    await connection('houses').update({state: "OFF"}).where('user_id', userVerified[0]).andWhere('house', other_houses[index].house)
                }
                await connection('houses').insert({id, house, state: "ON", user_id: userVerified[0]})
                return res.send({message: `Outras casas desativadas. Casa atual ativada: ${house}`})
            }
        }
    },






    async update(req,res){
        const {
            id,
            house,
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
        
        //verifica se o id da casa pertence ao usuario do token
        const selectedHouse = await connection('houses').select('*').where('id', id).andWhere('user_id', userVerified[0])
        //verifica se o usuario do token possui uma casa com msm nome
        let duplicated = await connection('houses').select('*').where('user_id', userVerified[0]).andWhere('house',house)
        //pega todas as casas cadastradas pelo usuario
        const allHouses = await connection('houses').select('*').where('user_id', userVerified[0])

        //se o id pertence ao usuario
        if(selectedHouse.length!=0){

            //se o usuario nao possui casa com este nome
            if(duplicated.length==0){
                //setar td como "OFF"
                for(index=0; index<allHouses.length; index++){
                    await connection('houses').update({state: "OFF"}).where('user_id', userVerified[0]).andWhere('house', allHouses[index].house)
                }
                //mudar o estado e nome = where(id).andWhere(user_id)
                await connection('houses').update({house: house, state: state}).where('id', id).andWhere('user_id', userVerified[0])
                return res.send({message: `Nome e estado atualizados`, data: {id, house, state, user_id: userVerified[0]}})
            }
            //casa com mesmo nome 
            else{
                //Verificar se = msm nome & msm id
                let duplicated_houseAndId = await connection('houses').select('*').where('user_id', userVerified[0]).andWhere('house',house).andWhere('id', id)
                //se é o mesmo nome e id
                if(duplicated_houseAndId!=0){
                    //mudar apenas state
                    await connection('houses').update({state: state}).where('user_id', userVerified[0]).andWhere('id', id)
                    //se estado anterior = "OFF" -> necessario setar todos como OFF antes
                    if((duplicated_houseAndId[0].state === "OFF")){
                        for(index=0; index<allHouses.length; index++){
                            await connection('houses').update({state: "OFF"}).where('user_id', userVerified[0]).andWhere('house', allHouses[index].house)
                        }
                        await connection('houses').update({house: house, state: state}).where('id', id).andWhere('user_id', userVerified[0])
                        if(state=="ON"){
                            return res.send({message: `Estado da casa ${house} ligado`, data: {id, house, state, user_id: userVerified[0]}})
                        }
                        else{
                            return res.send({message: `Nada a ser alterado`, data: {id, house, state, user_id: userVerified[0]}})
                        }
                    }
                    //se estado anterior = "ON" -> necessario setar apenas ele como "ONN"/"OFF"
                    else{
                        if(state=="ON"){
                            return res.send({message: `Nada a ser alterado`, data: {id, house, state, user_id: userVerified[0]}})
                        }
                        else{
                            return res.send({message: `Estado da casa ${house} desligada. Essa alteração provoca o desligamento de todos os sistemas`, data: {id, house, state, user_id: userVerified[0]}})
                        }
                    }
                }
                return res.send({message: `Casa com nome ja existente.`})
            }
        }
        else{
            return res.json({message: `Acesso de ids nao autorizados.`})
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

        const all_user_houses = await connection('houses').select('*').where('user_id', userVerified[0])
        return res.json({ all_user_houses })
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

        const house_id = req.headers.house_id
        await connection('houses').delete().where('user_id', userVerified[0]).andWhere('id', house_id)
        return res.json(`CASA COM ID = ${house_id} DELETADA`)
    }
}

/*
async update(req,res){
        const {
            id,
            house,
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
        
        let duplicated = await connection('houses').select('*').where('user_id', userVerified[0]).andWhere('house',house)
        const selectedHouse = await connection('houses').select('*').where('id', id).andWhere('user_id', userVerified[0])
        if(selectedHouse.length!=0){
            if(duplicated.length==0){
                const other_houses = await connection('houses').select('*').where('user_id', userVerified[0])
                if(other_houses.length==0){
                    //atualiza nova casa
                    await connection('houses').update({house: house, state: state}).where('user_id', userVerified[0]).andWhere('id',id)
                    return res.json({id, house, state: "ON", user_id: userVerified[0]})
                }
                else{
                    if((state==="ON")&&(selectedHouse[0].state === "OFF")){
                        //muda o estado de todas as outras casas para off
                        for(index=0; index<other_houses.length; index++){
                            await connection('houses').update({state: "OFF"}).where('user_id', userVerified[0]).andWhere('house', other_houses[index].house)
                        }
                        await connection('houses').update({house: house, state: state}).where('user_id', userVerified[0]).andWhere('id',id)                    
                        return res.send({message: `Outras casas desativadas. Casa atual ativada: ${house}`})
                    }

                    if(((state==="ON")&&(selectedHouse[0].state === "ON"))||((state==="OFF")&&(selectedHouse[0].state === "OFF"))){
                        //nada precisa ser feito                   
                        return res.send({message: `Nenhuma alteração foi feita`})
                    }

                    if((state==="OFF")&&(selectedHouse[0].state === "ON")){
                        //muda o estado de todas as casas para off. ESP nao tocara nenhum alarme pois nao havera casas ativadas
                        for(index=0; index<other_houses.length; index++){
                            await connection('houses').update({state: "OFF"}).where('user_id', userVerified[0]).andWhere('house', other_houses[index].house)
                        }
                        await connection('houses').update({house: house, state: state}).where('user_id', userVerified[0]).andWhere('id',id)                    
                        return res.send({message: `Todas as casas desativadas. Essa alteração provoca o desligamento de todos os sistemas`})
                    }
                }
            }
            else{
                return res.send({message: `Casa ${duplicated[0].house} já existente`})
            }
        }
        else{
            return res.json({message: `Casa com ids nao existentes... Tente dar refresh na pagina`})
        }

    },
*/
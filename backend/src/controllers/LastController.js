const connection = require('../database/connection');

module.exports = {
    async index(req,res){
        const mac_id = req.headers.mac_id

        const selectedEsp = await connection('esps').select('*').where('macid', mac_id)
        //verifica se o macid existe
        if(selectedEsp.length!=0){
            //verifica se o esp esta setado na função alarme
            if(selectedEsp[0].espfunction === "alarm"){
                const espState = await connection('houses').select('*').where('house', selectedEsp[0].house)
                //verifica se a casa nao foi deletada ou teve seu nome alterado...
                if(espState.length!=0){
                    //verifica se a casa esta ativada
                    if(espState[0].state === "ON"){
                        //buscar horario
                        let date_ob = new Date();
                        let day = date_ob.getDay();
                        let hour = date_ob.getHours();
                        let minute = date_ob.getMinutes();
                        let second = date_ob.getSeconds();

                        let dayCorrigido = day+1;
                        let dayoftheweek = '0'+dayCorrigido.toString()

                        //console.log("DATE")
                        //console.log(`date_ob => ${date_ob}`)
                        //console.log(`dayoftheweek => ${dayoftheweek}`)
                        //console.log(`hour => ${hour}`)
                        //console.log(`minute => ${minute}`)
                        //console.log(`second => ${second}`)

                        
                        const user_alarms = await connection('dowalarms').select('dayoftheweek', 'hour', 'minute')
                                                  .where('state', "ON").andWhere('user_id', selectedEsp[0].user_id).andWhere('dayoftheweek', dayoftheweek)
                                                  .orderBy('hour', 'desc').orderBy('minute','desc');

                        //COMPARAR HORARIO E ESCOLHER O PROXIMO ALARME QUE DEVE TOCAR
                        //compara hora. (-)alarme ainda n ocorreu. Qnt menor o numero mais proximo esta de tocar
                        function compareHour(localHour, dbHour){
                            return localHour - dbHour
                        }
                        function compareMinute(localMinute, dbMinute){
                            return localMinute - dbMinute
                        }
                        //console.log(compareHour(hour, user_alarms[0].hour), " h->m ", compareMinute(minute, user_alarms[0].minute))
                        
                        
                        function verify(localHour, dbHour, localMinute, dbMinute){
                            let differenceHour = compareHour(localHour, dbHour)
                            let differenceMinute = compareMinute(localMinute, dbMinute)

                            let acceptableHour = Math.sign(differenceHour)
                            //console.log(acceptableHour)
                            let acceptableMinute = Math.sign(differenceMinute)
                            if((acceptableHour === -1)||(acceptableHour === -0)||(acceptableHour === 0)){
                                // CAUTION
                                
                                if(((acceptableHour === -0)||(acceptableHour === 0))&&((acceptableMinute === -0)||(acceptableMinute === 0))){
                                    
                                    return {message: "TOCAR AGR"}

                                }
                            }
                        }


                        //console.log(verify(hour, user_alarms[0].hour, minute, user_alarms[0].minute))
                        if(user_alarms.length!=0){
                            for(index=0; index<user_alarms.length; index++){
                                let futureAlarms = verify(hour, user_alarms[index].hour, minute, user_alarms[index].minute)
                                if(futureAlarms!=undefined){
                                    return res.json({message: "TOCAR AGR"})
                                }
                            }
                            return res.json({message: "WAIT"})
                        }
                        else{
                            return res.json({message: "Nenhum alarme para hoje"})
                        }
                    }else{
                        return res.send({message: "Casa desativada. Alarme silenciado"})
                    }
                }
                else{
                    return res.send({message: "Casa não encontrada. Verifique se esta casa não foi deletada ou teve seu nome alterado."})
                }
            }
            else{
                return res.send({message: "Este ESP não é um dispositivo de alarme"})
            }
        }
        else{
            return res.send({message: `MACID não encontrado`})
        }
    }
}


/* GET QUE RETORNA O PROXIMO HORARIO DO ALARME
async index(req,res){
        const mac_id = req.headers.mac_id

        const selectedEsp = await connection('esps').select('*').where('macid', mac_id)
        //verifica se o macid existe
        if(selectedEsp.length!=0){
            //verifica se o esp esta setado na função alarme
            if(selectedEsp[0].espfunction === "alarm"){
                const espState = await connection('houses').select('*').where('house', selectedEsp[0].house)
                //verifica se a casa nao foi deletada ou teve seu nome alterado...
                if(espState.length!=0){
                    //verifica se a casa esta ativada
                    if(espState[0].state === "ON"){
                        //buscar horario
                        let date_ob = new Date();
                        let day = date_ob.getDay();
                        let hour = date_ob.getHours();
                        let minute = date_ob.getMinutes();
                        let second = date_ob.getSeconds();

                        let dayCorrigido = day+1;
                        let dayoftheweek = '0'+dayCorrigido.toString()

                        //console.log("DATE")
                        //console.log(`date_ob => ${date_ob}`)
                        //console.log(`dayoftheweek => ${dayoftheweek}`)
                        //console.log(`hour => ${hour}`)
                        //console.log(`minute => ${minute}`)
                        //console.log(`second => ${second}`)

                        
                        const user_alarms = await connection('dowalarms').select('dayoftheweek', 'hour', 'minute')
                                                  .where('state', "ON").andWhere('user_id', selectedEsp[0].user_id).andWhere('dayoftheweek', dayoftheweek)
                                                  .orderBy('hour', 'desc').orderBy('minute','desc');

                        //COMPARAR HORARIO E ESCOLHER O PROXIMO ALARME QUE DEVE TOCAR
                        //compara hora. (-)alarme ainda n ocorreu. Qnt menor o numero mais proximo esta de tocar
                        function compareHour(localHour, dbHour){
                            return localHour - dbHour
                        }
                        function compareMinute(localMinute, dbMinute){
                            return localMinute - dbMinute
                        }
                        //console.log(compareHour(hour, user_alarms[0].hour), " h->m ", compareMinute(minute, user_alarms[0].minute))
                        
                        
                        function verify(localHour, dbHour, localMinute, dbMinute){
                            let differenceHour = compareHour(localHour, dbHour)
                            let differenceMinute = compareMinute(localMinute, dbMinute)

                            let acceptableHour = Math.sign(differenceHour)
                            //console.log(acceptableHour)
                            let acceptableMinute = Math.sign(differenceMinute)
                            if((acceptableHour === -1)||(acceptableHour === -0)||(acceptableHour === 0)){
                                // CAUTION
                                
                                if(((acceptableHour === -0)||(acceptableHour === 0))&&((acceptableMinute === -1)||(acceptableMinute === -0)||(acceptableMinute === 0))){
                                    console.log("AINDA VAI TOCAR 0")
                                    return {hourVerified: differenceHour, minuteVerified: differenceMinute}

                                }
                                if((acceptableHour === -1)){
                                    console.log("AINDA VAI TOCAR -1")
                                    return {hourVerified: differenceHour, minuteVerified: differenceMinute}

                                }
                            }
                            else{
                                console.log("JA TOCOU")
                            }
                        }


                        //console.log(verify(hour, user_alarms[0].hour, minute, user_alarms[0].minute))
                        if(user_alarms.length!=0){
                            const alarmNext = []
                            const alarmTime = []
                            for(index=0; index<user_alarms.length; index++){
                                let futureAlarms = verify(hour, user_alarms[index].hour, minute, user_alarms[index].minute)
                                console.log(futureAlarms)
                                if(futureAlarms!=undefined){
                                    alarmNext.push({hour: futureAlarms.hourVerified, minute: futureAlarms.minuteVerified, index:index})
                                    alarmTime.push({hour: user_alarms[index].hour, minute: user_alarms[index].minute, index: index})
                                }
                            }
                            console.log("FIM DO FILTRO")
                            console.log("HORARIO")
                            console.log(alarmNext)
                            
                            let alarmeNextOrdered = alarmNext.sort()
                            let size = alarmeNextOrdered.length
                            let lastNext = alarmeNextOrdered[size-1]

                            let indexNext = lastNext.index
                            let nextAlarm = alarmTime.find(x => x.index === indexNext)
                            console.log("RESULTADO FINAL", nextAlarm.hour,":", nextAlarm.minute)
                            return res.send({message: `PROX ALARME AS ${nextAlarm.hour}:${nextAlarm.minute}` , user_alarms})
                        }
                        else{
                            return res.json({message: "Nenhum alarme para hoje"})
                        }
                        //return res.json({user_alarms})                                                              //teste
                    }else{
                        return res.send({message: "Casa desativada. Alarme silenciado"})
                    }
                }
                else{
                    return res.send({message: "Casa não encontrada. Verifique se esta casa não foi deletada ou teve seu nome alterado."})
                }
            }
            else{
                return res.send({message: "Este ESP não é um dispositivo de alarme"})
            }
        }
        else{
            return res.send({message: `MACID não encontrado`})
        }
    }
*/
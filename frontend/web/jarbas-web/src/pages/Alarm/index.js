import React, {useEffect, useState} from 'react';
import './styles.css';
import {FiLogOut} from 'react-icons/fi';
import {Link, useHistory} from 'react-router-dom';

import api from '../../services/api';


export default function Alarm(){
    const[userAlarms, setUserAlarms] = useState([])
    const [id, setId] = useState({})
    const [hour,setHour] = useState()
    const [minute,setMinute] = useState()
    const [state,setState] = useState()
    const [frequency,setFrequency] = useState([])

    function handleUpdate(event){
        event.preventDefault()
        //console.log(event.target.textContent)
        setId({id: event.target.attributes.value.value})
        let id = event.target.attributes.value.value
        let hour = event.target.nextSibling.firstElementChild.attributes.hour.value
        let minute = event.target.nextSibling.firstElementChild.attributes.minute.value
        let frequencyString = event.target.parentElement.lastChild.lastChild.firstChild.parentElement.attributes.frequency.value;
        let state = event.target.parentElement.lastChild.lastChild.firstChild.parentElement.attributes.state.value

        setHour(hour)
        setMinute(minute)
        setState(state)
        setFrequency(frequencyString)
        
        console.log(id)
        console.log(`${hour} horas e ${minute} minutos...`)
        console.log(frequencyString)
        console.log(state)
        
    }
    function handleTime(event){
        event.preventDefault()
        //console.log(event.target.textContent)
        setId(event.target.attributes.value.value)
        let id = event.target.attributes.value.value
        console.log(id)
    }
    function handleDetails(event){
        event.preventDefault()
        //console.log(event.target.textContent)
        setId(event.target.attributes.value.value)
        let id = event.target.attributes.value.value
        console.log(id)
    }

    
    

    async function GETalarms(bearerAuth){
        return await api.get('/alarms', {
            headers: { 'authorization': bearerAuth }
        })
    }

    useEffect(()=>{
        const auth = localStorage.getItem('jarbas_automation')
        let bearerAuth = 'Bearer ' + auth;
        //console.log(bearerAuth)

        GETalarms(bearerAuth).then(function(res){
            for(let index=0; index<res.data.all_user_alarms.length; index++){
                let oldAlarm = userAlarms
                setUserAlarms(oldAlarm => [...oldAlarm, res.data.all_user_alarms[index]])
            }
        })  
    },[])

    function AlarmList(props) {  
        const userAlarms = props.userAlarms;  
        const listItems = userAlarms.map((userAlarms) =>  

            <li key={userAlarms.id} >
                <div className="renderClock" value={`${userAlarms.id}`} onClick={handleUpdate}>
                    <div className="imgClock">{userAlarms.id}</div>
                </div>
                <div className="woodenBase">
                    <div className="time" value={`${userAlarms.id}`} hour ={`${userAlarms.hour}`} minute={`${userAlarms.minute}`} onClick={handleTime}>
                        <div className="imgTime">{userAlarms.hour}:{userAlarms.minute}</div>
                    </div>
                    <div className="details" value={`${userAlarms.id}`} frequency={userAlarms.frequency} state={userAlarms.state} onClick={handleDetails}>
                        <div className="imgDetails">{userAlarms.frequency.replace('01','Dom').replace('02','Seg').replace('03','Ter').replace('04','Qua').replace('05','Qui').replace('06','Sex').replace('07','Sab')}</div>
                    </div>
                </div>
            </li>  

        );  
        return (    
            <ul>{listItems}</ul>  
           
        );  
      }  
    
    
    //ABRIR NO INDEX ALARMS
    //AO CLICAR NO DETERMINADO ALARME, ACESSA O UPDATE ALARMS
    
    return(
        <div className="alarm-container">
            <div className="all_alarms-container">
            <AlarmList userAlarms={userAlarms} />
            </div>
            
            
        </div>
    )
}
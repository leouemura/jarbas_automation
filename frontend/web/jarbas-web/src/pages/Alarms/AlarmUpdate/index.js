import React, {useEffect, useState} from 'react';
import './styles.css';
import {Link, useHistory} from 'react-router-dom';
import api from '../../../services/api';


export default function AlarmUpdate(){
    const history = useHistory()
    const auth = localStorage.getItem('jarbas_automation')

    let ls_id = localStorage.getItem('alarm-id')
    let ls_hour = localStorage.getItem('alarm-hour')
    let ls_minute = localStorage.getItem('alarm-minute')
    let ls_frequency = localStorage.getItem('alarm-frequency')
    let ls_state = localStorage.getItem('alarm-state')    
    
    /*
    const id = useSelector(state => state.alarm.update.id)
    const hour = useSelector(state => state.alarm.update.hour)
    const minute = useSelector(state => state.alarm.update.minute)
    const frequency= useSelector(state => state.alarm.update.frequency)
    const state = useSelector(state => state.alarm.update.state)
    */
   
   const [idInput, setIdInput] = useState(ls_id)
   const [hourInput, setHourInput] = useState(ls_hour)
   const [minuteInput, setMinuteInput] = useState(ls_minute)
   const [frequencyInput, setFrequencyInput] = useState(ls_frequency)
   const [stateInput, setStateInput] = useState(ls_state)
   
    useEffect(()=>{
       let ls_id = localStorage.getItem('alarm-id')
       let ls_hour = localStorage.getItem('alarm-hour')
       let ls_minute = localStorage.getItem('alarm-minute')
       let ls_frequency = localStorage.getItem('alarm-frequency')
       let ls_state = localStorage.getItem('alarm-state')
       return ls_state.id, ls_hour, ls_minute, ls_frequency, ls_state
            
    },[])
        
    async function UPDATEalarms(event){
        event.preventDefault();
        let frequencyArray = frequencyInput.split(',')
        let inputdata = {
            id: idInput,
            hour: hourInput,
            minute: minuteInput,
            frequency: frequencyArray,
            state: stateInput,
            token: auth
        }
        const res = await api.put('/alarms', inputdata)
        console.log(res)
        if(res.status === 200){
            localStorage.setItem('alarm-id',idInput)
            localStorage.setItem('alarm-hour', hourInput)
            localStorage.setItem('alarm-minute', minuteInput)
            localStorage.setItem('alarm-frequency', frequencyInput)
            localStorage.setItem('alarm-state', stateInput)
            history.push('/alarms')
        }
        else{
            history.push('/alarms/update')
        }
        //continuar
    }

    return(
        <div className="register-container">
        <form onSubmit={UPDATEalarms}>    
            <input
                placeholder = "Hour"
                value={ /*(hourInput == '') ? hourState: */hourInput}
                onChange = { e => setHourInput(e.target.value) }
            /> 

            <input
                placeholder = "Minute"
                value={minuteInput}
                onChange = { e => setMinuteInput(e.target.value) }
            />

            <input
                placeholder = "Frequency"
                value={frequencyInput}
                onChange = { e => setFrequencyInput(e.target.value) }
            />

            <input
                placeholder = "State"
                value={stateInput}
                onChange = { e => setStateInput(e.target.value) }
            />


            <button>Salvar</button>
        </form>
        </div>
    )
}
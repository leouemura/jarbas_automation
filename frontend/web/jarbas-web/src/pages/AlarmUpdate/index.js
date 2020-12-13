import React, {useEffect, useState} from 'react';
import './styles.css';
import {FiLogOut} from 'react-icons/fi';
import {Link, useHistory} from 'react-router-dom';
import { ALARMACTIONS } from '../../components/store/action';
import {useSelector, useDispatch} from 'react-redux'
import api from '../../services/api';


export default function Alarm(){

    const id = useSelector(state => state.alarm.update.id)
    const hour = useSelector(state => state.alarm.update.hour)
    const minute = useSelector(state => state.alarm.update.minute)
    const frequency= useSelector(state => state.alarm.update.frequency)
    const state = useSelector(state => state.alarm.update.state)
    
    console.log('alarme')
    const [idState, setIdState] = useState(id)
    const [hourState, setHourState] = useState(hour)
    const [minuteState, setMinuteState] = useState(minute)
    const [frequencyState, setFrequencyState] = useState(frequency)
    const [stateState, setStateState] = useState(state)

    

    const auth = localStorage.getItem('jarbas_automation')
    
    const [idInput, setIdInput] = useState(idState)
    const [hourInput, setHourInput] = useState(hourState)
    const [minuteInput, setMinuteInput] = useState(minuteState)
    const [frequencyInput, setFrequencyInput] = useState(frequencyState)
    const [stateInput, setStateInput] = useState(stateState)

    useEffect(()=>{
        setIdState(id)
        setHourState(hour)
        setMinuteState(minute)
        setFrequencyState(frequency)
        setStateState(state)
    },[])
    
    async function UPDATEalarms(event){
        event.preventDefault();
        let frequencyArray = frequencyInput.split(',')
        let inputdata = {
            id: idState,
            hour: hourInput,
            minute: minuteInput,
            frequency: frequencyArray,
            state: stateInput,
            token: auth
        }
        const res = await api.put('/alarms', inputdata)
        console.log(res)
        //continuar
    }

    return(
        <div className="register-container">
          <form onSubmit={UPDATEalarms}>    
            <input
                placeholder = "Hour"
                value={ hourInput }
                onChange = { e => setHourInput(e.target.value) }
            /> 

            <input
                placeholder = "Minute"
                value={ minuteInput }
                onChange = { e => setMinuteInput(e.target.value) }
            />

            <input
                placeholder = "Frequency"
                value={ frequencyInput }
                onChange = { e => setFrequencyInput(e.target.value) }
            />

            <input
                placeholder = "State"
                value={ stateInput }
                onChange = { e => setStateInput(e.target.value) }
            />

            <button>Salvar</button>
          </form>
        </div>
    )
}
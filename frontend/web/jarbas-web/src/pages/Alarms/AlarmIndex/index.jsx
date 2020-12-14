import React, {useEffect, useState} from 'react';
import './styles.css';
import {Link, useHistory} from 'react-router-dom';
import api from '../../../services/api';

export default function AlarmIndex(){
    const history = useHistory()
    const auth = localStorage.getItem('jarbas_automation')

    let ls_id = localStorage.getItem('alarm-id')
    let ls_hour = localStorage.getItem('alarm-hour')
    let ls_minute = localStorage.getItem('alarm-minute')
    let ls_frequency = localStorage.getItem('alarm-frequency')
    let ls_state = localStorage.getItem('alarm-state')  

    return(
        <div className="container">
            <div className="user_alarm">
                <div className="imgClock">{ls_id}</div>
                <div className="imgTime">{ls_hour}:{ls_minute}</div>
                <div className="imgFrequency">{ls_frequency.toString().replace('01','Dom').replace('02','Seg').replace('03','Ter').replace('04','Qua').replace('05','Qui').replace('06','Sex').replace('07','Sab')}</div>
                <div className="imgState">{ls_state}</div>
            </div>
        </div>
    )
}
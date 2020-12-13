import React, {useState} from 'react';
import './styles.css';
import {FiLogOut} from 'react-icons/fi';
import {Link, useHistory} from 'react-router-dom';

import api from '../../services/api';


export default function Services(){
    //fzr animação lottie e trabalhar com scroll

    return(
        <div className="services-container">
            Services Page
            <Link to="/lamps">
                    <FiLogOut size={16} color="#E02041"/>
                    Lamp
            </Link>

            <Link to="/esps">
                    <FiLogOut size={16} color="#E02041"/>
                    Esp State
            </Link>
            <Link to="/alarms">
                    <FiLogOut size={16} color="#E02041"/>
                    Alarm
            </Link>
            <Link to="/houses">
                    <FiLogOut size={16} color="#E02041"/>
                    House
            </Link>
            <Link to="/login">
                    <FiLogOut size={16} color="#E02041"/>
                    LogOut
            </Link>
        </div>
    )
}
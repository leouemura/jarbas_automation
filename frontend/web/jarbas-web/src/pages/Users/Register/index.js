import React, {useState} from 'react';
import './styles.css';
import {FiArrowLeft} from 'react-icons/fi';
import {Link, useHistory} from 'react-router-dom';

import api from '../../../services/api';


export default function Register(){
    const [ username, setUsername ] = useState('');
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');

    const history = useHistory();

    async function handleSubmit(e){
        e.preventDefault();

        const userdata = {
            username, 
            email, 
            password
        }
        try{
            const res = await api.post('/users', userdata);
            console.log(res)
            if(res.data.message!=undefined){
                alert(`${res.data.message}`);
            }
            else{
                history.push('/login');
                alert(`ID de acesso criado! ID = ${res.data.user.id}`);
            }
        }catch{
            alert("Falha no processo... tente novamente");
        }
    }

    return(
        <div className="register-container">
          <form onSubmit={handleSubmit}>    
            <input
                placeholder = "Username"
                value={ username }
                onChange = { e => setUsername(e.target.value) }
            />

            <input
                placeholder = "Email"
                value={ email }
                onChange = { e => setEmail(e.target.value) }
            />

            <input
                placeholder = "Password"
                value={ password }
                onChange = { e => setPassword(e.target.value) }
            />

            <button type="submit" >Cadastrar</button>
          </form>
        </div>
    )
}
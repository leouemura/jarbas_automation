import React, {useState} from 'react';
import './styles.css';
import {FiLogIn} from 'react-icons/fi';
import {Link, useHistory} from 'react-router-dom';

import api from '../../../services/api';


export default function Login(){
    const [ username_email, setUsernameEmail ] = useState('');
    const [ passw, setPassword ] = useState('');
    const history = useHistory();

    async function handleSubmit(e){
        e.preventDefault();

        
            let username = username_email;
            let password = passw;
            let buff = Buffer.from(username + ':' + password).toString('base64')
            let basicAuth = 'Basic ' + buff;
            const res = await api.get('/authenticate', {
                headers: { 'authorization': basicAuth }
              }).then(function(res) {
                localStorage.setItem('jarbas_automation', res.data.token)
                console.log('Authenticated');
                history.push('/services');
              }).catch(function(error) {
                console.log('Error on Authentication', error);
              });
       
    }

    return(
        <div className="login-container">
            <section className="form">

            <form onSubmit={handleSubmit}>
                <h1>Faça seu login</h1>
                
                <input 
                placeholder="Usuario ou Email"
                value={ username_email }
                onChange = { e => setUsernameEmail(e.target.value) }
                />
                <input 
                placeholder="Password"
                value={ passw }
                onChange = { e => setPassword(e.target.value) }
                />

                <button className="button" type="submit">Entrar</button>
	
                <Link to="/register">
                    <FiLogIn size={16} color="#E02041"/>
                    Não tenho cadastro
                </Link>
            </form>

            </section>
        </div>
    )
}
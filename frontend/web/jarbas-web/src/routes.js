import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import Home from './pages/Home';

import Login from './pages/User/Login';
import Register from './pages/User/Register';
import Services from './pages/services';
import Alarm from './pages/Alarm';

export default function Routes(){
    return(
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={Home}/>
                <Route path="/login" component={Login}/>
                <Route path="/register" component={Register}/>
                <Route path="/services" component={Services}/>
                <Route path="/alarms" component={Alarm}/>
            </Switch>
        </BrowserRouter>
    );
}
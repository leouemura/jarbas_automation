import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import Home from './pages/Home';

import Login from './pages/Users/Login';
import Register from './pages/Users/Register';
import Services from './pages/Services';
import Alarm from './pages/Alarms/Alarm';
import AlarmUpdate from './pages/Alarms/AlarmUpdate';
import AlarmIndex from './pages/Alarms/AlarmIndex';

export default function Routes(){
    return(
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={Home}/>
                <Route path="/login" exact component={Login}/>
                <Route path="/register"  exact component={Register}/>
                <Route path="/services" exact component={Services}/>
                <Route path="/alarms" exact component={Alarm}/>
                <Route path="/alarms/update" exact component={AlarmUpdate}/>
                <Route path="/alarms/index" exact component={AlarmIndex}/>
            </Switch>
        </BrowserRouter>
    );
}
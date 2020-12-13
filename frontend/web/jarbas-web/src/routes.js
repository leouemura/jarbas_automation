import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import Home from './pages/Home';

import Login from './pages/User/Login';
import Register from './pages/User/Register';
import Services from './pages/services';
import Alarm from './pages/Alarm';
import AlarmUpdate from './pages/AlarmUpdate';

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
            </Switch>
        </BrowserRouter>
    );
}
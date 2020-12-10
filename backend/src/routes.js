const express = require('express');
const UserController = require('./controllers/UserController');
const LoginController = require('./controllers/LoginController');
const AlarmController = require('./controllers/AlarmController');
const HouseController = require('./controllers/HouseController');
const EspController = require('./controllers/EspController');
const routes = express.Router();

/* EXEMPLO 
const NewController = require('./controllers/NewController');

routes.get('/newroute', NewController.index);
routes.post('/newroute', NewController.create);
routes.put('/newroute', NewController.update);
routes.delete('/newroute', NewController.delete);
*/


routes.post('/users', UserController.create)
routes.get('/users', UserController.index)
routes.delete('/users', UserController.delete)


routes.get('/authenticate', LoginController.create)
routes.get('/me', LoginController.me)   //verifica se o usuario possui token valido e retorna dados do usuario


routes.post('/alarms', AlarmController.create)
routes.put('/alarms', AlarmController.update)
routes.get('/alarms', AlarmController.index)
routes.delete('/alarms', AlarmController.delete)


routes.post('/houses', HouseController.create)
routes.put('/houses', HouseController.update)
routes.get('/houses', HouseController.index)
routes.delete('/houses', HouseController.delete)


routes.post('/esps', EspController.create)
routes.put('/esps', EspController.update)
routes.get('/esps', EspController.index)
routes.delete('/esps', EspController.delete)




module.exports = routes;
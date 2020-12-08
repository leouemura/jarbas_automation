const express = require('express');
const routes = express.Router();

/* EXEMPLO 
const NewController = require('./controllers/NewController');

routes.get('/newroute', NewController.index);
routes.post('/newroute', NewController.create);
routes.put('/newroute', NewController.update);
routes.delete('/newroute', NewController.delete);
*/

const UserController = require('./controllers/UserController');

routes.post('/users', UserController.create)
routes.get('/users', UserController.index)
routes.delete('/users', UserController.delete)










module.exports = routes;
'use strict'

//Requires
var express = require('express');
var bodyParser = require('body-parser'); //convertir peticiones a objs javaScript
const http = require('http');
require('./database');

//Ejecutar express
var app = express();

//Cargar archivos de rutas
var user_router = require('./routes/user');
var category_router = require('./routes/category');
var price_router = require('./routes/price');
var subway_router = require('./routes/subway');
var sale_router = require('./routes/sale');

//Middlewares
app.use(bodyParser.urlencoded({extended: false}));//config necesaria par que la libreria funcione
app.use(bodyParser.json()); //convertir peticion a obj JSON

// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

//Reescribir rutas
app.use('/api', user_router);
app.use('/api', category_router);
app.use('/api', price_router);
app.use('/api', subway_router);
app.use('/api', sale_router);

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '3000';
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`API running on localhost:${port}`));

//Expresar modulos
module.exports = app; //exportar a manera global
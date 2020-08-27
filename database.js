'use strict'

var mongoose = require ('mongoose');//alias ya cargado en el npm por la libreria mongoose
var app = require('./server');
var port = process.env.PORT || 3000;

mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise; //activamos las promesas como modo de trabajo
mongoose.connect ('mongodb://database/subway_db', { useUnifiedTopology: true, useNewUrlParser: true }) //sacar el maximo rendimiento 
        .then (()=> {console.log('conexion exitosa');})
        .catch(error => console.log(error));

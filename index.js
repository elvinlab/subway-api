'use strict'

var mongoose = require ('mongoose');//alias ya cargado en el npm por la libreria mongoose
var app = require('./app');
var port = process.env.PORT || 3999;

mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise; //activamos las promesas como modo de trabajo
mongoose.connect ('mongodb://localhost:27017/subway_db', { useUnifiedTopology: true, useNewUrlParser: true }) //sacar el maximo rendimiento 
        .then (()=> {
            console.log('conexion exitosa');

            //Crear el server
            app.listen(port, () => {
                console.log("http://localhost:3999 esta trabajando");
            })
        })
        .catch(error => console.log(error));
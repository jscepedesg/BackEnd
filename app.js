'use strict'
//Optener las librerias
var express = require('express');
var bodyParser = require('body-parser');
//Ejecutar express
var app = express();

//cargar archivos de rutas
var project_routes = require('./routes/project');
//middlewares (Una capa que se ejecuta antes de la accion de un controlador)
//middleware global, configracion necesaria para bodyparser
app.use(bodyParser.urlencoded({extended:false}));
//Todo lo que le llege convierta en formato Json
app.use(bodyParser.json());

//CORS
// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});
//rutas
app.use('/api', project_routes);

//  exportar modulo
module.exports = app;
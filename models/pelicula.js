'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PeliculaSchema = Schema({
    nombre: String,
    sinopsis: String,
    clasificacion: String,
    duracion: Number,
    genero: String,
    director: String,
    reparto: String,
    pais: String,
    idioma: String,
    fecha_de_estreno: String,
    ruta_trailer: String,
    image: String
});

module.exports = mongoose.model('Pelicula',PeliculaSchema);
'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Pelicula = mongoose.model('Pelicula');

var CarteleraSchema = Schema({
    referenciaPelicula: { type: Schema.ObjectId, ref: "Pelicula" },
    fecha_de_publicacion: String
});

module.exports = mongoose.model('Cartelera',CarteleraSchema);
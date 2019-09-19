'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UsuarioSchema = Schema({
    name: String,
    lastName: String,
    email: String,
    password: String
});

module.exports = mongoose.model('Usuario',UsuarioSchema);
'use strict'
var Pelicula = require('../models/pelicula');
var Cartelera = require('../models/cartelera');
var Usuario = require('../models/usuario');
var fs = require('fs');
const jwt = require('jwt-simple');
const moment = require('moment');
const config = require('../config');
var path = require('path');

var controller = {
    //Controladores para modelo pelicula
    savePelicula: function(req, res){
        var pelicula = new Pelicula();
        var params = req.body;
        pelicula.nombre = params.nombre;
        pelicula.sinopsis = params.sinopsis;
        pelicula.clasificacion = params.clasificacion;
        pelicula.duracion = params.duracion;
        pelicula.genero = params.genero;
        pelicula.director = params.director;
        pelicula.reparto = params.reparto;
        pelicula.pais = params.pais;
        pelicula.idioma = params.idioma;
        pelicula.fecha_de_estreno = params.fecha_de_estreno;
        pelicula.ruta_trailer = params.ruta_trailer;
        pelicula.image = null;

        pelicula.save((err, peliculaStored) => {
            if(err) return res.status(500).send({message: 'Error al guardar el documento.'});

            if(! peliculaStored) return res.status(404).send({message: 'No se ha podido guardar la pelicula.'});

            return res.status(200).send({pelicula: peliculaStored});
        });
    }, 
    getPelicula: function(req, res){
        var peliculaId = req.params.id;

        if(peliculaId == null)
        {
            return res.status(404).send({message: 'La pelicula no existe.'});
        }

        Pelicula.findById(peliculaId, (err, pelicula) => {

            if(err) return res.status(500).send({message: 'Error al devolver los datos.'});

            if(! pelicula) return res.status(404).send({message: 'La pelicula no existe.'});

            return res.status(200).send({
                pelicula
            });

        });
    },
    getPeliculas: function(req, res){
        Pelicula.find({}).exec((err, peliculas) => {
            if(err) return res.status(500).send({message: 'Error al devolver los datos.'});  
            
            if(!peliculas) return res.status(404).send({message: 'No hay datos para mostrar.'});

            return res.status(200).send({peliculas});
        });
    },
    updatePelicula: function(req, res){
        var peliculaId = req.params.id;
        var update = req.body;

        Pelicula.findByIdAndUpdate(peliculaId, update,{new: true}, (err, peliculaUpdate) => {
            if(err) return res.status(500).send({message: 'Error al actualizar'});

            if(!peliculaUpdate) return res.status(404).send({message: 'No exite la pelicula para actualizar.'});

            return res.status(200).send({pelicula: peliculaUpdate});
        });

    },
    deletePelicula: function(req, res){
        var peliculaId = req.params.id;

        Pelicula.findByIdAndDelete(peliculaId, (err, peliculaRemoved) =>{
            if(err) return res.status(500).send({message: 'No se ha podido borrar el documento.'});

            if(!peliculaRemoved) return res.status(404).send({message: 'No se puede eliminar esa pelicula.'});

            return res.status(200).send({pelicula: peliculaRemoved});
        });
    },
    //Controladores para modelo cartelera
    savePeliculaEnCartelera: function(req, res){
        var cartelera = new Cartelera();
        var params = req.body;
        cartelera.referenciaPelicula = params.referenciaPelicula;
        cartelera.fecha_de_publicacion=params.fecha_de_publicacion;
        cartelera.save((err, CarteleraStored) => {
            if(err) return res.status(500).send({message: 'Error al guardar el documento.'});

            if(! CarteleraStored) return res.status(404).send({message: 'No se ha podido guardar la pelicula en la cartelera.'});

            return res.status(200).send({cartelera: CarteleraStored});
        });
    },
    getCartelera: function(req, res){
        Cartelera.find({referenciaPelicula: req.body.id}, (err, pelicula) => {
            if(err) return res.status(500).send({message: 'Error al guardar el documento.'});

            if(!pelicula) return res.status(404).send({message: 'La pelicula no esta en cartelera1'});

            req.pelicula= pelicula;

            if(pelicula!="")
            {
              return res.status(200).send(
                {
                    message: "La pelicula ya esta en cartelera",
                });
            }

            return res.status(404).send({message: 'La pelicula no esta en cartelera'});
            
        });
    },
    getCarteleraPeliculas: function(req, res){
        Cartelera.find({}, function(err, cartelera) {
            if(err) return res.status(500).send({message: 'Error al devolver los datos.'});  
            
            if(!cartelera) return res.status(404).send({message: 'No hay datos para mostrar.'});

            Pelicula.populate(cartelera, {path: "referenciaPelicula"},function(err, cartelera)
            {
                return res.status(200).send({cartelera});
            });
        });
    },
    deletePeliculaDeCartelera: function(req, res){
        var carteleraId = req.params.id;

        Cartelera.findOneAndDelete({"referenciaPelicula": carteleraId}, (err, carteleraRemoved) =>{
            if(err) return res.status(500).send({message: 'No se ha podido borrar el documento.'});

            if(!carteleraRemoved) return res.status(404).send({message: 'No se puede eliminar esa pelicula de la cartelera.'});

            return res.status(200).send({cartelera: carteleraRemoved});
        });
    },//CARGAR LA IMAGEN
    uploadImage: function(req, res){
        var peliculaId = req.params.id;
        var fileName = 'Imagen no subida...';

        if(req.files)
        {
            var filePath = req.files.image.path;
            var fileSplit = filePath.split('\\');
            var fileName = fileSplit[1];
            var extSplit = fileName.split('\.');
            var fileExt = extSplit[1];

            if(fileExt == 'png' || fileExt == 'jpg' || fileExt == 'jpeg' || fileExt == 'gif')
            {
                Pelicula.findByIdAndUpdate(peliculaId, {image: fileName}, {new: true} ,(err, peliculaUpdate) => {
                    if(err) return res.status(500).send({message: 'La imagen no se ha subido.'});
    
                    if(!peliculaUpdate) return res.status(404).send({message: 'La pelicula no existe.'});
    
                    return res.status(200).send({
                        pelicula: peliculaUpdate
                    });
                });
            }
            else
            {
                fs.unlink(filePath, (err) =>{
                    return res.status(200).send({message: 'La extensión no es válida'});
                });
            }
        }
        else
        {
            return res.status(200).send({
                message: fileName
            });
        }
    },
    //Controladores para modelo usuario
    saveUsuario: function(req, res){
        var usuario = new Usuario();
        var params = req.body;
        usuario.name = params.name;
        usuario.lastName = params.lastName;
        usuario.email = params.email;
        usuario.password = params.password;

        usuario.save((err, usuarioStored) => {
            if(err) return res.status(500).send({message: 'Error al guardar el documento.'});

            if(! usuarioStored) return res.status(404).send({message: 'No se ha podido guardar el usuario.'});

            return res.status(200).send({usuario: usuarioStored});
        });
    },
    loginUsuario: function(req, res)
    {
        Usuario.find({email: req.body.email, password: req.body.password }, (err, usuario) => {
            if(err) return res.status(500).send({message: 'Error al guardar el documento.'});

            if(!usuario) return res.status(404).send({message: 'No existe el usuario'});

            req.usuario= usuario;

            if(usuario!="")
            {
              return res.status(200).send(
                {
                    message: "Te has logueado correctamente",
                    usuario: usuario,
                    token:createToken(usuario)
                });
            }

            return res.status(401).send({message: 'No autorizado'});
            
        });
    },//Devolver la imagen
    getImageFile: function(req, res)
    {
        var file = req.params.image;
        var path_file = './uploads/'+file;

        fs.exists(path_file, (exists) => {
            if(exists)
            {
                return res.sendFile(path.resolve(path_file));
            }
            else
            {
                return res.status(200).send({
                    message: "No exite la imagen..."
                });
            }
        });
    }

};

function createToken(user)
{
    const payload = 
    {
        sub: user._id,
        iat: moment().unix(),
        exp: moment().add(14,'days').unix
    }

    return jwt.encode(payload, config.SECRET_TOKEN);
}

module.exports = controller;
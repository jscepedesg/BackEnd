'use strict'
 var express = require('express');
 var projectController = require('../controllers/project');

 var router = express.Router();

 var multipart = require('connect-multiparty');
 var multipartMiddleware = multipart({uploadDir: './uploads'});

 router.post('/save-pelicula',projectController.savePelicula);
 router.get('/pelicula/:id?', projectController.getPelicula);
 router.get('/peliculas', projectController.getPeliculas);
 router.put('/pelicula/:id', projectController.updatePelicula);
 router.delete('/pelicula/:id', projectController.deletePelicula);
 router.post('/save-pelicula-en-cartelera', projectController.savePeliculaEnCartelera);
 router.get('/cartelera-peliculas',projectController.getCarteleraPeliculas);
 router.delete('/cartelera-pelicula/:id',projectController.deletePeliculaDeCartelera);
 router.post('/upload-image/:id',multipartMiddleware, projectController.uploadImage);
 router.post('/save-usuario',projectController.saveUsuario);
 router.post('/signin', projectController.loginUsuario);
 router.post('/peliculaInCartelera', projectController.getCartelera);
 router.get('/get-image/:image',projectController.getImageFile);


 module.exports = router;
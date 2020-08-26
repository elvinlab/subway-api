'use strict'

var validator = require('validator');
var Category = require('../models/category');

var controller = {

    save: function (req, res) {

        // Recoger parametros por post
        var params = req.body;

        // Validar datos
        try {
            var validate_name = !validator.isEmpty(params.name);
            var validate_description = !validator.isEmpty(params.description);

        } catch (err) {
            return res.status(200).send({
                message: 'Faltan datos por enviar'
            });
        }

        if (validate_name && validate_description) {

            // Crear objeto a guardar
            var category = new Category();

            // Asignar valores
            category.name = params.name;
            category.description = params.description;

            Category.findOne({ name: category.name }, (err, issetCategory) => { //"encontrar uno"

                if (err) {
                    return res.status(500).send({
                        message: "Error al comprobar duplicidad de categoria"
                    });
                }

                if (!issetCategory) {// Si no exite

                    // Guardar el category
                    category.save((err, categoryStored) => {

                        if (err) {
                            return res.status(500).send({
                                message: "Error al guardar la categoria"
                            });
                        }

                        if (!categoryStored) {
                            return res.status(400).send({
                                message: "La cateogria no se ha guardado"
                            });
                        }

                        // Devolver una respuesta
                        return res.status(200).send({
                            status: 'success',
                            category: categoryStored
                        });
                    });

                } else {
                    return res.status(200).send({
                        message: "Categoria ya esta registrada"
                    });
                }

            });

        } else {
            return res.status(200).send({
                message: 'Los datos no son validos'
            });
        }
    },

    update: function (req, res) {

        // Recoger el id del category de la url
        var categoryId = req.params.id;

        // Recoger los datos que llegan desde post
        var params = req.body;

        // Validar datos
        try {
            var validate_name = !validator.isEmpty(params.name);
            var validate_description = !validator.isEmpty(params.description);

        } catch (err) {
            return res.status(200).send({
                message: 'Faltan datos por enviar'
            });
        }

        if (validate_name && validate_description) {

            // Montar un json con los datos modificables
            var update = {
                name: params.name,
                description: params.description
            };

            //Validar nombre unico en la BD
            Category.findOne({ name: params.name }, (err, issetCategory) => { //"encontrar uno"

                if (err) {
                    return res.status(500).send({
                        message: "Error al comprobar duplicidad de categoria"
                    });
                }

                if (issetCategory && issetCategory.id != categoryId) {
                    return res.status(500).send({
                        message: "Nombre de categoria ya existe"
                    });
                } else {
                    // Find and update del categoria por id
                    Category.findOneAndUpdate({ _id: categoryId }, update, { new: true }, (err, categoryUpdated) => {
                        if (err) {
                            return res.status(500).send({
                                status: 'error',
                                message: 'Error en la peticion'
                            });
                        }

                        if (!categoryUpdated) {
                            return res.status(404).send({
                                status: 'error',
                                message: 'No existe esta categoria'
                            });
                        }

                        // Devolver respuesta
                        return res.status(200).send({
                            status: 'success',
                            category: categoryUpdated
                        });
                    });
                }

            });

        } else {
            // Devolver respuesta
            return res.status(200).send({
                message: 'La validacion de los datos no es correcta'
            });
        }
    },

    getCategory: function (req, res) {
        // Sacar el id del categoria de la url
        var categoryId = req.params.id;

        // Find por id del categoria
        Category.findById(categoryId).exec((err, category) => {
            if (err || !category) {
                return res.status(500).send({
                    status: 'error',
                    message: 'No existe la categoria'
                });
            }
            // Devolver resultado
            return res.status(200).send({
                status: 'success',
                category
            });
        });
    },

    getCategories: function (req, res) {
        Category.find().exec((err, categories) => {
            if (err || !categories) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay categorias que mostrar'
                });
            }

            return res.status(200).send({
                status: 'success',
                categories
            });
        });

    },

	delete: function(req, res){

		// Sacar el id del topic de la url
		var categoryId = req.params.id;

		// Find and delete por categoryId 
		Category.findOneAndDelete({_id: categoryId}, (err, categoryRemoved) => {

			if(err){
					return res.status(500).send({
										status: 'error',
										message: 'Error en la peticion'
					});
			}

			if(!categoryRemoved){
					return res.status(404).send({
									status: 'error',
									message: 'No se ha borrado la categoria'
					});
			}

			// Devolver respuesta
			return res.status(200).send({
				status: 'success',
				category: categoryRemoved
			});
		});
	},
}

module.exports = controller;
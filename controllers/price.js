'use strict'

var validator = require('validator');
var Price = require('../models/price');

var controller = {

    save: function (req, res) {

        // Recoger parametros por post
        var params = req.body;

        // Validar datos
        try {
            var validate_size = !validator.isEmpty(params.size);
            var validate_price= !validator.isEmpty(params.price);

        } catch (err) {
            return res.status(200).send({
                message: 'Faltan datos por enviar'
            });
        }

        if (validate_size && validate_price) {

            // Crear objeto a guardar
            var price = new Price();

            // Asignar valores
            price.size = params.size;
            price.price = params.price;

            Price.findOne({ size: price.size }, (err, issetPrice) => { //"encontrar uno"

                if (err) {
                    return res.status(500).send({
                        message: "Error al comprobar duplicidad del tipo"
                    });
                }

                if (!issetPrice) {// Si no exite

                    // Guardar el price
                    price.save((err, priceStored) => {

                        if (err) {
                            return res.status(500).send({
                                message: "Error al guardar"
                            });
                        }

                        if (!priceStored) {
                            return res.status(400).send({
                                message: "La cateogria no se ha guardado"
                            });
                        }

                        // Devolver una respuesta
                        return res.status(200).send({
                            status: 'success',
                            price: priceStored
                        });
                    });

                } else {
                    return res.status(200).send({
                        message: "Lo siento. Ya esta registrado"
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

        // Recoger el id del price de la url
        var priceId = req.params.id;

        // Recoger los datos que llegan desde post
        var params = req.body;

        // Validar datos
        try {
            var validate_size = !validator.isEmpty(params.size);
            var validate_price= !validator.isEmpty(params.price);

        } catch (err) {
            return res.status(200).send({
                message: 'Faltan datos por enviar'
            });
        }

        if (validate_size && validate_price) {

            // Montar un json con los datos modificables
            var update = {
                size: params.size,
                price: params.price
            };

            //Validar nombre unico en la BD
            Price.findOne({ size: params.size }, (err, issetPrice) => { //"encontrar uno"

                if (err) {
                    return res.status(500).send({
                        message: "Error al comprobar duplicidad"
                    });
                }

                if (issetPrice && issetPrice.id != priceId) {
                    return res.status(500).send({
                        message: "Lo siento. Nombre de ya existe"
                    });
                } else {
                    // Find and update del tipo por id
                    Price.findOneAndUpdate({ _id: priceId }, update, { new: true }, (err, priceUpdated) => {
                        if (err) {
                            return res.status(500).send({
                                status: 'error',
                                message: 'Error en la peticion'
                            });
                        }

                        if (!priceUpdated) {
                            return res.status(404).send({
                                status: 'error',
                                message: 'No existe'
                            });
                        }

                        // Devolver respuesta
                        return res.status(200).send({
                            status: 'success',
                            price: priceUpdated
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

    getPrice: function (req, res) {
        // Sacar el id del tipo de la url
        var priceId = req.params.id;

        // Find por id del tipo
        Price.findById(priceId).exec((err, price) => {
            if (err || !price) {
                return res.status(500).send({
                    status: 'error',
                    message: 'No existe'
                });
            }
            // Devolver resultado
            return res.status(200).send({
                status: 'success',
                price
            });
        });
    },

    getPrices: function (req, res) {
        Price.find().exec((err, prices) => {
            if (err || !prices) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay tipos que mostrar'
                });
            }

            return res.status(200).send({
                status: 'success',
                prices
            });
        });

    },

	delete: function(req, res){

		// Sacar el id del topic de la url
		var priceId = req.params.id;

		// Find and delete por priceId 
		Price.findOneAndDelete({_id: priceId}, (err, priceRemoved) => {

			if(err){
					return res.status(500).send({
										status: 'error',
										message: 'Error en la peticion'
					});
			}

			if(!priceRemoved){
					return res.status(404).send({
									status: 'error',
									message: 'No se ha borrado'
					});
			}

			// Devolver respuesta
			return res.status(200).send({
				status: 'success',
				price: priceRemoved
			});
		});
	},
}

module.exports = controller;
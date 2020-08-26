'use strict'

var validator = require('validator');
var Subway = require('../models/subway');
var path = require('path');
var fs = require('fs');

var controller = {

	test: function (req, res) {
		return res.status(200).send({
			message: 'Hola que tal!!'
		});
	},

	save: function (req, res) {

		// Recoger parametros por post
		var params = req.body;

		// Validar datos
		try {
			var validate_price = !validator.isEmpty(params.price);
			var validate_category = !validator.isEmpty(params.category);
			var validate_name = !validator.isEmpty(params.name);

		} catch (err) {
			return res.status(200).send({
				message: 'Faltan datos por enviar'
			});
		}

		if (validate_price && validate_category && validate_name) {

			// Crear objeto a guardar
			var subway = new Subway();

			// Asignar valores
			subway.name = params.name;
			subway.user = req.user.sub;
			subway.price = params.price;
			subway.category = params.category;

			Subway.findOne({ name: subway.name }, (err, issetSubway) => { //"encontrar uno"

				if (err) {
					return res.status(500).send({
						message: "Error al comprobar duplicidad del subway"
					});
				}

				if (!issetSubway) {// Si no exite

					// Guardar el subway
					subway.save((err, subwayStored) => {

						if (err || !subwayStored) {
							return res.status(404).send({
								status: 'error',
								message: 'El subway no se ha guardado.'
							});
						}

						// Devolver una respuesta
						return res.status(200).send({
							status: 'success',
							subway: subwayStored
						});
					});

				} else {
					return res.status(200).send({
						message: "Subway ya esta registrado."
					});
				}

			});

		} else {
			return res.status(200).send({
				message: 'Los datos no son validos'
			});
		}
	},

	getSubways: function (req, res) {

		// Cargar la libreria de paginacion en la clase (MODELO)

		// Recoger la pagina actual
		if (!req.params.page || req.params.page == 0 || req.params.page == "0" || req.params.page == null || req.params.page == undefined) {
			var page = 1;
		} else {
			var page = parseInt(req.params.page);
		}

		// Indicar las opciones de paginacion
		var options = {
			sort: { date: -1 }, //Orden descendente
			populate: ('user price category'), //cargar "relacion entre tablas"

			limit: 5,
			page: page
		};

		// Find paginado
		Subway.paginate({}, options, (err, subways) => {

			if (err) {
				return res.status(500).send({
					status: 'error',
					message: 'Error al hacer la consulta'
				});
			}

			if (!subways) {
				return res.status(404).send({
					status: 'error',
					message: 'No hay subways'
				});
			}

			// Devoler resultado (subways, total de subways, total de paginas)
			return res.status(200).send({
				status: 'success',
				subways: subways.docs,
				totalDocs: subways.totalDocs,
				totalPages: subways.totalPages
			});

		});
	},

	getSubwaysByUser: function (req, res) {

		// Conseguir el id del usuario
		var userId = req.params.user;

		// Find con una condiciÃ³n de usuario
		Subway.find({ user: userId }).sort([['date', 'descending']]).exec((err, subways) => {

			if (err) {
				// Devolver resultado
				return res.status(500).send({
					status: 'error',
					message: 'Error en la peticion'
				});
			}

			if (!subways) {
				// Devolver resultado
				return res.status(404).send({
					status: 'error',
					message: 'No hay subways para mostrar'
				});
			}

			// Devolver resultado
			return res.status(200).send({
				status: 'success',
				subways
			});
		});
	},

	getSubway: function (req, res) {
		// Sacar el id del subway de la url
		var subwayId = req.params.id;

		// Find por id del subway
		Subway.findById(subwayId)
			.populate('user')
			.populate('price')
			.populate('category')
			.populate('sales.user')
			.exec((err, subway) => {

				if (err) {
					return res.status(500).send({
						status: 'error',
						message: 'Error en la peticion'
					});
				}

				if (!subway) {
					return res.status(404).send({
						status: 'error',
						message: 'No existe el subway'
					});
				}

				// Devolver resultado
				return res.status(200).send({
					status: 'success',
					subway
				});
			});
	},

	update: function (req, res) {

		// Recoger el id del category de la url
		var subwayId = req.params.id;

		// Recoger los datos que llegan desde post
		var params = req.body;

		// Validar datos
		try {
			var validate_price = !validator.isEmpty(params.price);
			var validate_category = !validator.isEmpty(params.category);
			var validate_name = !validator.isEmpty(params.name);

		} catch (err) {
			return res.status(200).send({
				message: 'Faltan datos por enviar'
			});
		}

		if (validate_price && validate_category && validate_name) {
			// Montar un json con los datos modificables
			var update = {
				name: params.name,
				user: req.user.sub,
				price: params.price,
				category: params.category
			};

			//Validar nombre unico en la BD
			Subway.findOne({ name: params.name }, (err, issetSubway) => { //"encontrar uno"

				if (err) {
					return res.status(500).send({
						message: "Error al comprobar duplicidad del subway"
					});
				}

				if (issetSubway && issetSubway.id != subwayId) {
					return res.status(500).send({
						message: "Nombre el subway ya existe"
					});
				} else {
					// Find and update del subway por id
					Subway.findOneAndUpdate({ _id: subwayId, user: req.user.sub }, update, { new: true }, (err, subwayUpdated) => {
						if (err) {
							return res.status(500).send({
								status: 'error',
								message: 'Error en la peticion'
							});
						}

						if (!subwayUpdated) {
							return res.status(404).send({
								status: 'error',
								message: 'No existe este subway'
							});
						}

						// Devolver respuesta
						return res.status(200).send({
							status: 'success',
							category: subwayUpdated
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

	delete: function (req, res) {

		// Sacar el id del subway de la url
		var subwayId = req.params.id;

		// Find and delete por subwayID y por userID 
		Subway.findOneAndDelete({ _id: subwayId, user: req.user.sub }, (err, subwayRemoved) => {

			if (err) {
				return res.status(500).send({
					status: 'error',
					message: 'Error en la peticion'
				});
			}

			if (!subwayRemoved) {
				return res.status(404).send({
					status: 'error',
					message: 'No se ha borrado el subway'
				});
			}

			// Devolver respuesta
			return res.status(200).send({
				status: 'success',
				subway: subwayRemoved
			});
		});
	},

	uploadSubway: function (req, res) {
		// Configurar el modulo multiparty (md) routes/subway.js
		// Recoger el fichero de la peticion
		var file_name = 'Imagen de subway no subida...';

		if (!req.files) {
			return res.status(404).send({
				status: 'error',
				message: file_name
			});
		}

		// Conseguir el nombre y la extension del archivo
		var file_path = req.files.file0.path;
		//var file_split = file_path.split('\\');

		// ** Adventencia ** En linux o mac
		var file_split = file_path.split('/');

		// Nombre del archivo
		var file_name = file_split[2];

		// Extension del archivo
		var ext_split = file_name.split('\.');
		var file_ext = ext_split[1];

		// Comprobar extension (solo imagenes), si no es valida borrar fichero subido
		if (file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif') {
			fs.unlink(file_path, (err) => { // funcion callback  fs = libreria js para manipular ficheros, unlink = borrar archivo de la paticion

				return res.status(200).send({
					status: 'error',
					message: 'La extension del archivo no es valida.'
				});

			});

		} else {
			// Sacar el id del subway
			var subwayId = req.params.id;

			// Buscar y actualizar documento bd
			Subway.findOneAndUpdate({ _id: subwayId }, { image: file_name }, { new: true }, (err, subwayUpdated) => {
				if (err || !subwayUpdated) {
					// Devolver respuesta
					return res.status(500).send({
						status: 'error',
						message: 'Error al guardar el subway'
					});
				}

				// Devolver respuesta
				return res.status(200).send({
					status: 'success',
					subway: subwayUpdated
				});

			});
		}

	},

	getSubwayFile: function (req, res) {
		var fileName = req.params.fileName;
		var pathFile = './uploads/subways/' + fileName;

		fs.exists(pathFile, (exists) => {
			if (exists) {
				return res.sendFile(path.resolve(pathFile));
			} else {
				return res.status(404).send({
					message: 'La imagen no existe'
				});
			}
		});
	},

	search: function (req, res) {

		// Sacar string a buscar de la url
		var searchString = req.params.search;

		// Find or 
		Subway.find({
			"$or": [
				{ "name": { "$regex": searchString, "$options": "i" } },
				//{ "param2": { "$regex": searchString, "$options": "i" } },
				//{ "param3": { "$regex": searchString, "$options": "i" } },
				//{ "param4...": { "$regex": searchString, "$options": "i" } }
			]
		})
			.populate('user')
			.populate('price')
			.populate('category')
			.sort([['date', 'descending']])
			.exec((err, subways) => {

				if (err) {
					return res.status(500).send({
						status: 'error',
						message: 'Error en la peticion'
					});
				}

				if (!subways) {
					return res.status(404).send({
						status: 'error',
						message: 'No hay subways disponibles'
					});
				}

				return res.status(200).send({
					status: 'success',
					subways
				});

			});
	},

};

module.exports = controller;
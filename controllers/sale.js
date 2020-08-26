'use strict'

var validator = require('validator');

var Subway = require('../models/subway');

var controller = {

	add: function (req, res) {

		// Recoger el id del subway de la url
		var subwayId = req.params.subwayId;

		// Find por id del subway
		Subway.findById(subwayId).exec((err, subway) => {

			if (err) {
				return res.status(500).send({
					status: 'error',
					message: 'Error en la petición'
				});
			}

			if (!subway) {
				return res.status(404).send({
					status: 'error',
					message: 'No existe el subway'
				});
			}


			// Comprobar objeto usuario y validar datos
			if (req.body.amount) {

				// Validar datos
				try {
					var validate_amount = !validator.isEmpty(req.body.amount);

				} catch (err) {
					return res.status(200).send({
						message: 'No has reportado la venta!!'
					});
				}

				if (validate_amount) {

					var sale = {
						user: req.user.sub,
						amount: req.body.amount
					};

					// En la propiedad sales del objeto resultante hacer un push
					subway.sales.push(sale);

					// Guardar el subway completo
					subway.save((err) => {

						if (err) {
							return res.status(500).send({
								status: 'error',
								message: 'Error en al guardar la venta'
							});
						}

						Subway.findById(subway._id)
							.populate('user')
							.populate('sales.user')
							.exec((err, subway) => {

								if (err) {
									return res.status(500).send({
										status: 'error',
										message: 'Error en la petición'
									});
								}

								if (!subway) {
									return res.status(404).send({
										status: 'error',
										message: 'No existe la'
									});
								}

								// Devolver resultado
								return res.status(200).send({
									status: 'success',
									subway
								});
							});

					});

				} else {
					return res.status(200).send({
						message: 'No se han validado los datos del comantario !!'
					});
				}

			} else {
				// Devolver respuesta
				return res.status(200).send({
					message: 'La validacion de los datos no es correcta'
				});
			}
		});

	},

	update: function (req, res) {

		// Conseguir id de comentario que llega de la url
		var saleId = req.params.saleId;

		// Recoger datos y validar
		var params = req.body;

		// Validar datos
		try {
			var validate_amount = !validator.isEmpty(params.amount);

		} catch (err) {
			return res.status(200).send({
				message: 'No has editado la venta!!'
			});
		}

		if (validate_amount) {

			// Find and update de subdocumento
			Subway.findOneAndUpdate(
				{ "sales._id": saleId },
				{
					"$set": {
						"sales.$.amount": params.amount
					}
				},
				{ new: true },
				(err, subwayUpdated) => {

					if (err) {
						return res.status(500).send({
							status: 'error',
							message: 'Error en la petición'
						});
					}

					if (!subwayUpdated) {
						return res.status(404).send({
							status: 'error',
							message: 'No existe el subway'
						});
					}

					// Devolver datos
					return res.status(200).send({
						status: "success",
						subway: subwayUpdated
					});
				});
		} else {
			// Devolver respuesta
			return res.status(200).send({
				message: 'La validacion de los datos no es correcta'
			});
		}

	},

	delete: function (req, res) {

		// Sacar el id del subway y de la venta a borrar
		var subwayId = req.params.subwayId;
		var saleId = req.params.saleId;

		// Buscar el subway
		Subway.findById(subwayId, (err, subway) => {

			if (err) {
				return res.status(500).send({
					status: 'error',
					message: 'Error en la petición'
				});
			}

			if (!subway) {
				return res.status(404).send({
					status: 'error',
					message: 'No existe el subway'
				});
			}

			// Seleccionar el subdocumento (venta)
			var sale = subway.sales.id(saleId);

			// Borrar ela venta
			if (sale) {
				sale.remove();

				// Guardar el subway
				subway.save((err) => {

					if (err) {
						return res.status(500).send({
							status: 'error',
							message: 'Error en la petición'
						});
					}

					Subway.findById(subway._id)
						.populate('user')
						.populate('sales.user')
						.exec((err, subway) => {

							if (err) {
								return res.status(500).send({
									status: 'error',
									message: 'Error en la petición'
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

				});

			} else {
				return res.status(404).send({
					status: 'error',
					message: 'No existe la venta'
				});
			}

		});
	}
};

module.exports = controller;
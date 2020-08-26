'use strict'

var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate-v2');

var Schema = mongoose.Schema;

// Modelo de SALE
var SaleSchema = Schema({
    amount: Number, //solo para modo de practica
    date: { type: Date, default: Date.now },
    user: { type: Schema.ObjectId, ref: 'User' },
});

var Sale = mongoose.model('Sale', SaleSchema);

//Modelo de SUBWAY
var SubwaySchema = Schema({
    name: String,
    image: String,
    date: { type: Date, default: Date.now },
    user: { type: Schema.ObjectId, ref: 'User' },
    price: { type: Schema.ObjectId, ref: 'Price' },
    category: { type: Schema.ObjectId, ref: 'Category' },
    sales: [SaleSchema],
});

// Cargar paginacion   
SubwaySchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Subway', SubwaySchema);

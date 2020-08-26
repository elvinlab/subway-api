'use strict'

var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate-v2');

var Schema = mongoose.Schema;

//Modelo de Type
var TypeSchema = Schema({
    size: String,
    price: Number, 
});

// Cargar paginacion
TypeSchema.plugin(mongoosePaginate);

module. exports = mongoose.model('Price', TypeSchema);

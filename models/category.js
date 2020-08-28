'use strict'

var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate-v2');

var Schema = mongoose.Schema;

//Modelo de Category
var CategorySchema = Schema({
    name: String, 
    description: String,
});

// Cargar paginacion
CategorySchema.plugin(mongoosePaginate);
module. exports = mongoose.model('Category', CategorySchema);
//algo mas
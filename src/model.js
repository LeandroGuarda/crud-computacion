const mongoose = require('mongoose')

// Definir el modelo y el esquema de mongoose

const compuArtSchema = new mongoose.Schema(
    {
    codigo: { type: Number, required: true },
    nombre: { type: String, required: true },
    precio: { type: Number, required: true },
    categoria: { type: String, required: true }

})

const Articulos = mongoose.model('Articulos', compuArtSchema)

module.exports = Articulos
const express = require('express')
const app = express()
const port = 3000
const Articulos = require('./src/model')
process.loadEnvFile()
const connectDB = require('./src/mongoose')

const morgan = require('morgan')

app.use(express.json())
app.use(morgan('tiny'))



//CONECTAR  A MONGO DB USANDO MONGOOSE
connectDB()


app.post('/articulos', (req,res) =>{
 const newArticulo = new Articulos(req.body)
 newArticulo
 .save()
 .then((articuloGuardado) =>{
  res.status(201).json(articuloGuardado)
 })
 .catch((error) =>{
  console.log("Error en agregar el articulo", error);
  res.status(500).send('Error en agregar el articulo')
 })
})





// Endpoint para obtener todos los articulos o de una categoria
app.get('/articulos', (req, res) => {
  console.log('entro por aca')
  const { categoria } = req.query;
  
  // const query = categoria ? { "categoria": { "$regex": "^Accesorios$", "$options": "i" } } : {}
    const query = categoria ? { "categoria": { "$regex": categoria, "$options": "i" } } : {}
  console.log(Articulos)
  Articulos.find(query)
    .then(art => {
      if (art.length === 0) {
        console.log('No se encontraron artículos');
      }
      res.send(art);  // Enviar los artículos encontrados como respuesta JSON
    })
    .catch(error => {
      console.error('Error al obtener artículos', error);
      res.status(500).send('Error al obtener los artículos');
    });
});

// Obtener un articulo por id
app.get('/articulos/:id', (req, res) => {

  const { id } = req.params;
  Articulos.findById(id)
    .then(art => {
      if (!art) {
        console.log('No se encontró el artículo');
      }
      res.json(art);  // Enviar el artículo encontrado como respuesta JSON
    })
    .catch(error => {
      console.error('Error al obtener el artículo', error);
      res.status(500).send('Error al obtener el artículo');
    });
})


const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

app.get('/articulos/:id', (req, res) => {
  const { id } = req.params;

  // Verificar si el id es un ObjectId válido
  if (!ObjectId.isValid(id)) {
    return res.status(400).send('ID inválido');
  }

  Articulos.findById(id)
    .then(art => {
      if (!art) {
        console.log('No se encontró el artículo');
        return res.status(404).send('No se encontró el artículo');
      }
      res.json(art);  // Enviar el artículo encontrado como respuesta JSON
    })
    .catch(error => {
      console.error('Error al obtener el artículo', error);
      res.status(500).send('Error al obtener el artículo');
    });
});



// Actualizar un articulo

app.put('/articulos/:id', (req, res) => {
  const { id } = req.params;

  // Verificar si el id es un ObjectId válido
  if (!ObjectId.isValid(id)) {
    return res.status(400).send('ID inválido');
  }

  const { nombre, categoria, precio, codigo } = req.body;

  const updatedArticulo = { nombre, categoria, precio, codigo, _id: id };

  Articulos.findByIdAndUpdate(id, updatedArticulo, { new: true })
   .then(art => {
      if (!art) {
        console.log('No se encontró el artículo');
        return res.status(404).send('No se encontró el artículo');
      }
      res.json(art);  // Enviar el artículo actualizado como respuesta JSON
    })

     .catch(error => {
        console.error('Error al actualizar el artículo', error);
        res.status(500).send('Error al actualizar el artículo');
      });
});





app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})
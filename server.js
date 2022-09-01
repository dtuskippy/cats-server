'use strict';

// REQUIRE
require('dotenv').config();
const express = require('express');
const cors = require('cors');

// bring in mongoose
const mongoose = require('mongoose');

// Bring in our Model - functionality to interact with my db

const Cat = require('./models/cat.js');

// connect Mongoose to our MongDB
mongoose.connect(process.env.DB_URL);


// add validation to confirm we are wired up to our mongoDB
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Mongoose is connected');
});

// USE
// implement express
const app = express();

// middleware -- app.use parses incoming object...
app.use(cors());
app.use(express.json());

// define PORT validate env is working
const PORT = process.env.PORT || 3002;

// ROUTES
app.get('/', (request, response) => {
  response.status(200).send('Welcome!');
});

// ENDPOINT  - GET Cats from our DB and send it to our Front End
app.get('/cats', getCats);

async function getCats(request, response, next) {
  try {
    let results = await Cat.find();
    response.status(200).send(results);
  } catch (error) {
    next(error);
  }
}

app.post('/cats', postCat);

async function postCat(request, response, next) {
  console.log(request.body);
  try {
    const newCat = await Cat.create(request.body);
    response.status(201).send(newCat);

  } catch (error) {
    next(error);
  }

}

app.delete('/cats/:id', deleteCat);

async function deleteCat(request, response, next) {
  const id = request.params.id;
  console.log(id);
  try {
    await Cat.findByIdAndDelete(id);
    response.status(204).send('success!'); //you first assumed 'newCat' structure from POST and it did work, but that's why you got it back

  } catch (error) {
    next(error);
  }
}



app.get('*', (request, response) => {
  response.status(404).send('Not availabe');
});

// ERROR
app.use((error, request, response, next) => {
  response.status(500).send(error.message);
});

// LISTEN
app.listen(PORT, () => console.log(`listening on Port ${PORT}`));
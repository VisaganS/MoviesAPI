/*********************************************************************************
* WEB422 – Assignment 1
* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Name: Visagan Student ID: 102768199 Date: September 18, 2022
* Cyclic Link: _______________________________________________________________
*
********************************************************************************/ 

var express = require('express');
var path = require('path');
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();
const MoviesDB = require("./modules/moviesDB.js");
const db = new MoviesDB(process.env.MONGODB_CONN_STRING);
const HTTP_PORT = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.json());

db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
  app.listen(HTTP_PORT, ()=>{
  console.log(`server listening on: ${HTTP_PORT}`);
  });
 }).catch((err)=>{
  console.log(err);
 });

 //default route
app.get("/", function (req, res) {
  res.json({ message: 'API Listening' })
});

//get movies with title and page filter
app.get("/api/movies", (req, res) => {
  db.getAllMovies(req.query.page, req.query.perPage, req.query.title)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(500);
    });
});

//get 1 movie
app.get("/api/movies/:id", (req, res) => {
  db.getMovieById(req.params.id)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      console.log(err);
      res
        .status(500)
        .json({ message: `Failed to retrieve movie with id: ${req.params.id}` });
    })
})

//add 1 movie
app.post("/api/movies", (req, res) => {
  db.addNewMovie(req.body)
    .then((data) => {
      res.status(201).json({ message: data });
    })
    .catch((err) => {
      console.log(err);
      res
        .status(500)
        .json({ message: `Failed to add a new movie: ${req.body.name}` });
    })
})

//update a movie using id
app.put("/api/movies/:id", (req, res) => {
  db.updateMovieById(req.body, req.params.id)
    .then((data) => {
      res.status(204).json({ message: data });
    })
    .catch((err) => {
      console.log(err);
      res
        .status(500)
        .json({ message: `Failed to update movie with id: ${req.params.id}` });
    })
})

//delete a movie
app.delete("/api/movies/:id", (req, res) => {
  db.deleteMovieById(req.params.id)
    .then((data) => {
      res.status(200).json({ message: data });
    })
    .catch((err) => {
      console.log(err);
      res
        .status(500)
        .json({ message: `Failed to delete movie with id: ${req.params.id}` });
    })
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

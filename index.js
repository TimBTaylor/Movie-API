const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Models = require("./models.js");

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect("mongodb://localhost:27017/myFlixDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

topMovies = [
  { title: "movie1" },
  { title: "movie2" },
  { title: "movie3" },
  { title: "movie4" }
];

app.use(express.static("public"));

app.use(express.static("public/documentation.html"));

app.use(morgan("common"));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something has gone wrong!");
});

app.get("/movies", (req, res) => {
  res.json(topMovies);
});

app.get("/movies/:title", (req, res) => {
  res.json(
    topMovies.find(function(movie) {
      return movie.title === req.params.title;
    })
  );
});

app.get("/movies/:title/genre", (req, res) => {
  res.send("successful GET request on movie genre");
});

app.get("/movies/director/:name", (req, res) => {
  res.send("successful GET request on director information");
});

app.post("/users", (req, res) => {
  Users.findOne({ Username: req.body.Username })
    .then(user => {
      if (user) {
        return res.status(400).send(req.body.Username + "already exists");
      } else {
        Users.create({
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday
        })
          .then(user => {
            res.status(201).json(user);
          })
          .catch(error => {
            console.error(error);
            res.status(500).send("Error: " + error);
          });
      }
    })
    .catch(error => {
      console.error(error);
      res.status(500).send("Error: " + error);
    });
});

app.get("/users", (req, res) => {
  Users.find()
    .then(users => {
      res.status(201).json(users);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

app.put("/users/:username/:newusername", (req, res) => {
  res.send("successful PUT request on changing username");
});

app.post("/users/:username/movies/:movieID", (req, res) => {
  res.send("successful POST request on adding movie");
});

app.delete("/users/:username/movies/:movieID", (req, res) => {
  res.send("successful DELETE request on removing a movie");
});

app.delete("/users/:username", (req, res) => {
  res.send("successful DELETE request on users account");
});

app.listen(8080, () => {
  console.log("This web server is listening on port 8080.");
});

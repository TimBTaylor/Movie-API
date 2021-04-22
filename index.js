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

app.use(bodyParser.json());

app.use(express.static("public"));

app.use(express.static("public/documentation.html"));

app.use(morgan("common"));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something has gone wrong!");
});

//GET request to return all movies and information about them
app.get("/movies", (req, res) => {
  Movies.find()
    .then(movies => {
      res.status(201).json(movies);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//GET request to recieve infromation about a movie via the title
app.get("/movies/:title", (req, res) => {
  Movies.findOne({ Title: req.params.title })
    .then(movie => {
      res.json(movie);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//GET request to recieve information about a genre
app.get("/movies/genres/:Genre", (req, res) => {
  Movies.findOne({ "Genre.Name": req.params.Genre })
    .then(genre => {
      res.status(201).json(genre.Genre);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//GET request returns information about a director via their name
app.get("/movies/directors/:Director", (req, res) => {
  Movies.findOne({ "Director.Name": req.params.Director })
    .then(director => {
      res.status(201).json(director.Director);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// CREATES new user and returns their entered information
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

//GET request for admin to return all the users
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

//GET request to return information about a single user
app.get("/users/:Username", (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then(user => {
      res.json(user);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//UPDATES user information
app.put("/users/:Username", (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.Username },
    {
      $set: {
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      }
    },
    { new: true }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
      } else {
        res.json(updatedUser);
      }
    }
  );
});

//UPDATES users favorites movies
app.post("/users/:Username/Movies/:MovieID", (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.Username },
    {
      $addToSet: { FavoriteMovies: req.params.MovieID }
    },
    { new: true },
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
      } else {
        res.json(updatedUser);
      }
    }
  );
});

//Removes movie from users favorites
app.delete("/users/:Username/Movies/:MovieID", (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.Username },
    {
      $pull: { FavoriteMovies: req.params.MovieID }
    },
    { new: true },
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
      } else {
        res.json(updatedUser);
      }
    }
  );
});

//Removes users account information
app.delete("/users/:Username", (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then(user => {
      if (!user) {
        res.status(400).send(req.params.Username + " was not found");
      } else {
        res.status(200).send(req.params.Username + " was deleted.");
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

app.listen(8080, () => {
  console.log("This web server is listening on port 8080.");
});

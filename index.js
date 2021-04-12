const express = require("express");
const app = express();
const morgan = require("morgan");

app.use(express.static("public"));

app.use(express.static("public/documentation.html"));

app.use(morgan("common"));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something has gone wrong!");
});

topMovies = [
  { movie1: "movie1" },
  { movie2: "movie2" },
  { movie3: "movie3" },
  { movie4: "movie4" }
];

app.get("/movies", (req, res) => {
  res.json(topMovies);
});

app.get("/movies/:title", (req, res) => {
  res.send("successful GET request on specified movie info");
});

app.get("/movies/:title/genre", (req, res) => {
  res.send("successful GET request on movie genre");
});

app.get("/movies/director/:name", (req, res) => {
  res.send("successful GET request on director information");
});

app.post("/users", (req, res) => {
  res.send("successful POST request on creating user");
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

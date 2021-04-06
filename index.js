const express = require("express");
const app = express();

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
  res, json(topMovies);
});

app.get("/", (req, res) => {
  res.send("This is my practice code");
});

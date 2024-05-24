const express = require("express");
const cors = require("cors");
const {getEndpoints} = require('./controllers/get-controllers')

const eventRoute = require("./routes/events");
const userRoute = require("./routes/users");
const categoriesRoute = require("./routes/categories")

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/users", userRoute);

app.use("/api/categories", categoriesRoute)

app.use("/api/events", eventRoute);

app.get("/api", getEndpoints)

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send(err);
  }
  if (err.code === "23502") {
    res.status(400).send({ msg: "invalid object passed" });
  }
  if (err.code === "22P02") {
    res.status(400).send({ msg: "invalid event id input" });
  }
  if (err.code === "23503") {
    res.status(404).send({ msg: "username not found" });
  }
});
module.exports = app;

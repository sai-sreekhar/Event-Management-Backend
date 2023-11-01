const serverless = require("serverless-http");
const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.get("/api/get-info", (req, res) => {
  console.log("hello World");
  res.send({
    application: "sample-application",
    version: "1.0",
    creator: "John Doe",
  });
});
app.post("/api/get-post-data", (req, res) => {
  res.send({ ...req.body });
});
module.exports.handler = serverless(app);

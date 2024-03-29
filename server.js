const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config({
  path: "./.env",
});
const http = require("http");

const port = process.env.PORT;
app.set("view engine", "ejs");

// const server = http.createServer();
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

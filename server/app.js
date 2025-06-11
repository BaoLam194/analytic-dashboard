const express = require("express");
const app = express();

require("dotenv").config();

// parse form
app.use(express.urlencoded({ extended: true }));

// parse application/json
app.use(express.json());

const hostname = "127.0.0.1";
const port = 3000;

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

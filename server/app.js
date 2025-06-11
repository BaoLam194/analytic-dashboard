const express = require("express");
const app = express();

require("dotenv").config();

//parse form input
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(express.json());

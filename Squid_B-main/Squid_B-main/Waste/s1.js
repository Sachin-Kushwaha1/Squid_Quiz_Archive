const express = require("express");
const mongoose = require("mongoose");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const bodyParser = require("body-parser");

const isSelected = require("./controller/isSelected.js");
const saveToken = require("./controller/saveToken.js");
const checkToken = require("./controller/checkToken.js");
const firstlogin = require("./controller/firstlogin.js");
const finalgame = require("./controller/Final.js");
const endthank = require("./controller/thank.js");

app.set("view engine", "ejs");
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// // For Level 2
app.put("/user/select_cand", isSelected);

// // Level 2 token
app.post("/user/get_token", saveToken);

// // Submit token
app.post("/user/verify_token", checkToken);
// // Home page

app.post("/user/Start_Game", firstlogin);

app.post("/user/End_Game", finalgame);

app.post("/user/End", endthank);




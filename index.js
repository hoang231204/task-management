const express = require('express');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 3000;
const database = require('./config/database');
const bodyParser = require('body-parser');
const cors = require('cors');
const route = require('./api/v1/routes/index-route');
//database
database.connect();
//body parser
app.use(bodyParser.json());
//cors
app.use(cors());
//routes
route(app);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
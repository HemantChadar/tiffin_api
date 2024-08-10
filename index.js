const conection = require('./Conection/conection');
const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json())
app.use(cors());

const userApi = require('./Routers/Routes'); 

app.use("/api/", userApi);

 


app.listen(8000);

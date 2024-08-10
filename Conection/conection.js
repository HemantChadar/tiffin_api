const mysql = require('mysql');


const conection = mysql.createConnection({
    host:'localhost',
    user:"root",
    password:'',
    database:'l9_tiffin_v1_db'
});

conection.connect((err)=>{
    if(err){
        console.log("error in connection");
    }else{
        console.log("connection succesfull");
    }
});

module.exports = conection;
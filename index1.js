const express = require('express');
const mysql = require('mysql2');
const app = express();
app.set('view engine', 'ejs');
const port = 8000;
const { v4: uuidv4 } = require('uuid'); 

app.use(express.urlencoded({ extended: true })); // Middleware to parse form data
const path = require('path');
app.set("views", path.join(__dirname, "/views"));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'sql_server',
    password: 'Poovi;;29'
});

app.get('/user/new', (req, res) => {
    let id = uuidv4();
    res.render('new.ejs', { id });
});

app.post('/user/:id', (req, res) => {
    let { id } = req.params;
    let { username: username, type: type, email: email, password: password } = req.body; // getting form data from new.ejs
    let q = `INSERT INTO user (id, username, type, email, password) VALUES ('${id}', '${username}', '${type}', '${email}', '${password}')`;
    try {
        connection.query(q, (err, result) => {   //connection.query find any placeholder and it finds then it get them & put them in it's query
            if(err) throw err;  // throw err and go to catch(err) to print
            res.redirect(`/user/patient?type=${type}`);
        });
    } catch(err) {
        console.log(err);
        res.send("some error to push data in DB");
    }
});

app.get('/user/patient', (req, res) => {
    let { type } = req.query;
    let q = `SELECT * FROM user where type = ?`;
    try {
        connection.query(q, [type], (err, users) => {
            if(err) throw err;

            res.render('show.ejs', { user: users });
        });
    } catch(err) {
        console.log(err);
        res.send("some error in DB");
    } 
});

app.get('/user/doctor', (req, res) => {
    let { type } = req.query;
    let q = `SELECT * FROM user where type = ?`;
    try {
        connection.query(q, [type], (err, users) => {
            if(err) throw err;

            res.render('show.ejs', { user: users });
        });
    } catch(err) {
        console.log(err);
        res.send("some error in DB");
    } 
});
    
app.get('/', (req, res) => {
    res.render('home.ejs');
});

app.listen(port, (req, res) => {
    console.log('Server is running on port ' + port);
});

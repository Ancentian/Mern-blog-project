require('dotenv').config();

const express = require('express');
const expressLayout = require('express-ejs-layouts');

//Database Files 
const connectDB = require('./server/config/db');

const app = express();

const PORT  = 5000 || process.env.PORT;

// Connect to DB
connectDB();

//Body Parser
app.use(express.urlencoded({extended: true}));
app.use(express.json());

//Public Folder
app.use(express.static('public'));

//EJS Templating Engine
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

//ROUTES
app.use('/', require('./server/routes/main'));
app.use('/', require('./server/routes/admin'));

app.listen(PORT, () => {
    console.log(`App Listening on port ${PORT}`);
})
require('dotenv').config();

const express = require('express');
const expressLayout = require('express-ejs-layouts');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');

//Database Files 
const connectDB = require('./server/config/db');
const session = require('express-session');
const {isActiveRoute} = require('./server/helpers/routeHelpers');

const app = express();

const PORT  = 5000 || process.env.PORT;

// Connect to DB
connectDB();

//Body Parser
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    }),
}));

//Public Folder
app.use(express.static('public'));

//EJS Templating Engine
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

app.locals.isActiveRoute = isActiveRoute;

//ROUTES
app.use('/', require('./server/routes/main'));
app.use('/', require('./server/routes/admin'));

app.listen(PORT, () => {
    console.log(`App Listening on port ${PORT}`);
})
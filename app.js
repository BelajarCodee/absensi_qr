require('dotenv').config();
const express = require('express');
const ip = require('ip');
const routes = require('./routes/UserRoute');
const path = require('path');
const db = require('./config/database');
const userModel = require('./models/UserModel');
const absensiModel = require('./models/AbsensiModel');
const session = require('express-session');
const sequelizeStore = require('connect-session-sequelize');
const flash = require('express-flash');
const bodyParser = require('body-parser');

const ipA = ip.address();
const app = express();
const port = process.env.PORT || 6000;


app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

const sessionStore = sequelizeStore(session.Store);

const store = new sessionStore ({
    db: db,
});

db.sync()
  .then(() => {
        console.log('Tables created');
      })
      .catch((error) => {
            console.error('Error creating tables:', error);
          });
        
        
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: true,
    saveUninitialized: true,
    store: store,
}));
        
app.use(flash());
app.use(routes);

store.sync();


app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}/ atau di http://${ipA}:${port}/`);
});
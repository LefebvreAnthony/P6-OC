require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const sauceRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');

const path = require('path');

mongoose.set('useCreateIndex', true);

//Connsection au serveur
mongoose.connect(process.env.MONGODB_URL,
{ useNewUrlParser: true,
  useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));
  
const app = express();
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
    windowMs: 25 * 60 * 1000,
    max: 100
});

// Sécurité
app.use(limiter);
app.use(helmet());


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
 });

 app.use(bodyParser.json());

 app.use('/images', express.static(path.join(__dirname, 'images')));
 app.use('/api/sauces', sauceRoutes); 
app.use('/api/auth', userRoutes);


module.exports = app;
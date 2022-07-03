const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

mongoose.connect('mongodb+srv://geekyFutbolist:29101998@cluster0.ro7ldje.mongodb.net/?retryWrites=true&w=majority');
mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use('/products', productRoutes)
app.use('/orders', orderRoutes)

app.use((req,res,next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
})

app.use((err, req, res, next) => {
    res.status( err.status || 500)
        .json({
            err: {
                message: err.message,
            }
        })
})
 app.use((req, res, next) => {
     res.header("Access-Control-Allow_Origin", "*");
     res.header("Access-Control-Allow-Headers", "*");
     if(req.method === 'OPTIONS') {
         res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
         return res.status(200).json({});
     }
 })



module.exports = app;
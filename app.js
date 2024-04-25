const express = require('express')
const createHttpErrors = require('http-errors')
const morgan = require('morgan') 
const mongoose =require('mongoose')
const createHttpError = require('http-errors')
require('dotenv').config()
const session = require('express-session');
const connectFlash = require('connect-flash');

// Initialization
const app = express()
app.use(morgan('dev'));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json())
app.use(express.urlencoded({extended: false}))

// Init session
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitalized:false,
        cookie: {
            // secure: true ,
            httpOnly: true
        }
    })
);

app.use(connectFlash());

app.use('/', require('./routes/index.route'));
app.use('/auth',require('./routes/auth.route'))
app.use('/',require('./routes/user.route'));

app.use((req,res,next)=>{
    next(createHttpError.NotFound());
});
app.use((error,req,res,next)=>{
    error.status =error.status || 500
    res.status(error.status)
    res.render('error40x', {error} )
});
const PORT = process.env.PORT || 3000

mongoose.connect(process.env.MONGO_URI,{
    dbName: process.env.DB_NAME,
    useNewUrlParser: true,
    useUnifiedTopology:true,
    //createIndexes: true,
    //findOneAndUpdate: false,
    useUnifiedTopology: true,
}).then(()=>{
    console.log('Database connected...')
    app.listen(PORT, () => console.log(`on port ${PORT}`))
}).catch(err=> console.log(err.message));


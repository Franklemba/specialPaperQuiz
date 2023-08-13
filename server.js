require("dotenv").config()
const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const methodOverride = require('method-override')

const homeRouter = require('./routes/index')
const adminRouter = require('./routes/admin')



// connecting to database
//mongodb+srv://franklemba:kU3XmafGzdHYYzfX@cluster0.xnljw5s.mongodb.net/?retryWrites=true&w=majority
mongoose.connect("mongodb+srv://franklemba:kU3XmafGzdHYYzfX@cluster0.xnljw5s.mongodb.net/?retryWrites=true&w=majority").then(()=>{
    // mongoose.connect("mongodb://localhost:27017/specialPaperQuiz").then(()=>{    
    console.log('database is connected')
   }).catch((err)=> console.log('error connecting to database ',err))

//////setting up the server///////

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views/')
app.set('layout','layouts/layout')
app.use(expressLayouts)
app.use(express.static(__dirname + '/public/'))
app.use(bodyParser.urlencoded({limit: '10mb', extended: false}));
app.use(express.urlencoded({ extended: false }))


app.use(methodOverride('_method'))

app.use('/',homeRouter );
app.use('/admin', adminRouter);


app.listen(process.env.PORT || 3111,()=> console.log('Server is Running at port 3111'))

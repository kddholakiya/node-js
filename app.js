const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const bodyParser = require('body-parser')
const session = require('express-session');
const mongoose = require('mongoose')
const db = require('./config/db').mongodb
app.set('view engine','ejs')

mongoose.connect(db,{
    useNewUrlParser : true,
    useUnifiedTopology : true
})
.then(()=>{
    console.log('connected');
})

app.use(
    session({
      secret: 'your-secret-key',
      resave: false,
      saveUninitialized: false,
    })
  );

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/assets',express.static('assets'))
app.use('/user',require('./routers/user'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
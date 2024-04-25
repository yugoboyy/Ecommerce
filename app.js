const express = require('express')
const app = express()
const session = require('express-session')
const port = 3000

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'rahasia',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false,
        sameSite: true
     }
  }))
app.use(require('./routes/route'))

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

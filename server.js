require('dotenv').config()

const express = require('express')
const session = require('express-session')
const passport = require('passport')
const MySQLStore = require('express-mysql-session')(session);
const handlebars = require('express-handlebars')
const app = express()
const bodyParser = require('body-parser')

const port = 3000



const sessionStore = new MySQLStore({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

// Config Middleware
app.use(session({
    key: 'refugio_session_key',
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24
    }
}));

const hbs = handlebars.create({ defaultLayout: 'main' }, {allowProtoMethodsByDefault: true})
app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')

app.use(passport.initialize())
app.use(passport.session())
app.use(express.static('public'))
app.use(bodyParser.json({ limit: '10mb' }))
app.use(bodyParser.urlencoded({limit: '10mb' , extended: true}))

// Importar as rotas
const index = require('./src/routes/index')
const auth = require('./src/routes/auth')
const admin = require('./src/routes/admin')
const ask = require('./src/routes/ask')

app.use('/auth', auth)
app.use('/', index)
app.use('/admin', admin)
app.use('/refugiocristao', ask)



app.listen(port, () => {
    console.log(`SERVER ARE RUNNING ON ${port} PORT`)
})

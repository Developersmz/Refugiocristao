require('dotenv').config()

const express = require('express')
const handlebars = require('express-handlebars')
const app = express()
const bodyParser = require('body-parser')

const port = 2024

const hbs = handlebars.create({ defaultLayout: 'main' }, {allowProtoMethodsByDefault: true})
app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')

app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// Importar as rotas
const routes = require('./src/index')
app.use('/', routes)
app.use('/about', routes)
app.use('/respostas', routes)
// Database operations
app.use('/shower/:id', routes)
app.use('/addresp', routes)
app.use('/newAnswer', routes)
app.use('/newAnswer/output', routes)
app.use('/editresp', routes)
app.use('/editAnswer/:id', routes)
app.use('/saveChanges', routes)
app.use('/deleteresp', routes)
app.use('/deleteAnswer/:id', routes)
// Admin routes
app.use('/admincheck', routes)
app.use('/admincheck', routes)
app.use('/logout', routes)
app.use('/dashboard', routes)



app.listen(port, () => {
    console.log('SERVER ARE RUNNING...')
})

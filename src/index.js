require('dotenv').config()

const express = require('express')
const session = require('express-session')
const app = express()
const MySQLStore = require('express-mysql-session')(session);
const bcrypt = require('bcryptjs')
const { User, Answer, About } = require('../models/Models');

const sessionStore = new MySQLStore({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

// Config Middleware
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))
app.use(session({
    key: 'refugio_session_key',
    secret: process.env.SESSION_SECRET || 'hsdhgshgdshgdhjhsahsausuahsauhsaiiahsiahsansnkanaisniansaaag',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24
    }
}));

//app.use(router)

// Middleware para verificar se o user esta logado
function checkLogin(req, res, next) {
    if (req.session.user) {
        next()
    } else {
        res.redirect('/admincheck')
    }
}

// Checar se tem permissoes de administrador
function checkAdmin(req, res, next){
    if (req.session.user && req.session.user.isAdmin){
        next()
    }
    else{
        return res.status(403).send('Acesso negado')
    }
}

// Rota inicial
app.get('/', async (req, res) => {
    try{
        // About content
        about = await About.findAll()
        aboutContent = about.map(content => content.toJSON())

        res.render('index', {about: aboutContent})
    }
    catch(e){
        res.status(500).send('Erro interno no servidor')
    }
})

// About 
app.get('/about', checkLogin, checkAdmin, (req, res) => {
    res.render('about')
})

app.post('/about', (req, res) => {
    const { title, text } = req.body
    const about = {
        title: title,
        text: text
    }
    About.findOne()
    .then(existingRow => {
        if (existingRow) {
            return existingRow.update(about)
        } else {
            return About.create(about)
        }
    }).then(() => res.redirect('/')).catch(() => res.send('<h1>Erro ao atualizar a tabela</h1>'))
})

// Adicionar resposta
app.get('/addresp', checkLogin, checkAdmin, (req, res) => {
    res.render('addform')
})

app.post('/newAnswer', (req, res) => {
    Answer.create({
        title: req.body.title,
        category: req.body.category,
        answer: req.body.answer
    }).then(() => res.redirect('/respostas')).catch(() => res.send('<h1>Erro ao atualizar a tabela</h1>'))
})

// Editar resposta
app.get('/editresp', checkLogin, checkAdmin, async (req, res) => {
    try{
        answers = await Answer.findAll({order: [['id', 'ASC']]})
        answerContent = answers.map(content => content.toJSON())
        res.render('editform', {answers: answerContent})
    }
    catch(e){
        res.status(500).send('Erro interno no servidor')
    }
})

app.get('/editAnswer/:id', checkLogin, checkAdmin, async (req, res) => {
    const answer = await Answer.findByPk(req.params.id)
    answerItem = answer.toJSON()
    res.render('editform', {answer: answerItem})
})

// Salvar alteracoes e atualizar a resposta
app.post('/saveChanges', (req, res) => {
    Answer.update({title: req.body.title, 
        category: req.body.category,
        answer: req.body.answer}, {where: {
        id: req.body.id
    }}).then(() => {
        res.redirect('/respostas')
    }).catch((e) => {
        res.send('<h1>Erro ao atualizar a tabela</h1>')
    })
    
})

// Eliminar resposta
app.get('/deleteresp', checkLogin, checkAdmin, async (req, res) => {
    try{
        answers = await Answer.findAll()
        answerContent = answers.map(content => content.toJSON())
        res.render('deleteform', {answers: answerContent})
    } catch(e) {
        console.error('ERRO: ', e)
        res.status(500).send('Erro interno no servidor')
    }
})

// Eliminar uma resposta especifica
app.get('/deleteAnswer/:id', checkLogin, checkAdmin, (req, res) => {
    Answer.destroy({where: {'id': req.params.id}}).then(() => {
        res.redirect('/deleteresp')
    }).catch((e) => {
        res.send('<h1>Erro ao atualizar a tabela</h1>')
    })
    
})

// Rota das respostas
app.get('/respostas', async (req, res) => {
    try{
        answers = await Answer.findAll({order: [['title', 'ASC']]})
        answerContent = answers.map(content => content.toJSON())
        res.render('respostas', {answers: answerContent})
    }
    catch(e){
        console.error('ERRO: ', e)
        res.status(500).send('Erro interno no servidor')
    }
})

// Mostrar uma resposta especifica
app.get('/shower/:id', async (req, res) => {
    answer = await Answer.findByPk(req.params.id)
    content = answer.toJSON()
    res.render('shower', {answer: content})
})


// Rota do Dashboard Adminstrativo
app.get('/admincheck', (req, res) => {
    res.render('login')
})

router.post('/admincheck', async (req, res) => {
    const { username, password } = req.body
    const user = await User.findOne({where: {username} })

    if (user && bcrypt.compareSync(password, user.password)){
        req.session.user = {
            id: user.id,
            username: user.username,
            isAdmin: user.isAdmin
        }
        res.redirect('/dashboard')
    } else {
        console.log("Dados de login incorretos!")
        res.redirect('/admincheck')
    }
    
})

app.get('/dashboard', checkLogin, checkAdmin, async (req, res) => {
    database = await Answer.findAll()
    coutItems = await Answer.count()
    databaseContent = database.map(content => content.toJSON())
    res.render('dashboard', {database: databaseContent, coutItems: coutItems})
})

app.get('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/')
})

module.exports = app

require('dotenv').config()

const express = require('express')
const session = require('express-session')
const bcrypt = require('bcryptjs')
const router = express.Router()
const Answer = require('../models/Answer')
const { User } = require('../models/User')


const app = express()

const MySQLStore = require('express-mysql-session')(session);
const sequelize = require('../models/db')

const sessionStore = new MySQLStore({}, sequelize);


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


// Middleware para verificar se o user esta logado
function checkLogin(req, res, access) {
    if (req.session.user) {
        access()
    } else {
        req.flash('error', 'Faça login para acessar esta página');
        res.redirect('/admincheck')
    }
}

// Checar se tem permissoes de administrador
function checkAdmin(req, res, access){
    if (req.session.user && req.session.user.isAdmin){
        access()
    }
    else{
        res.status(403).send('Acesso negado')
    }
}

// Rota inicial
router.get('/', (req, res) => {
    res.render('index')
})

// Adicionar resposta
router.get('/addresp', checkLogin, checkAdmin, (req, res) => {
    res.render('addform')
})

router.post('/newAnswer', (req, res) => {
    Answer.create({
        title: req.body.title,
        category: req.body.category,
        answer: req.body.answer
    }).then(() => res.redirect('/respostas')).catch((e) => console.error('Erro: ', e))
})

// Editar resposta
router.get('/editresp', checkLogin, checkAdmin, async (req, res) => {
    try{
        answers = await Answer.findAll({order: [['id', 'ASC']]})
        answerContent = answers.map(content => content.toJSON())
        res.render('editform', {answers: answerContent})
    }
    catch(e){
        console.error('ERRO: ', e)
        res.status(500).send('Erro interno no servidor')
    }
})

router.get('/editAnswer/:id', checkLogin, checkAdmin, async (req, res) => {
    const answer = await Answer.findByPk(req.params.id)
    answerItem = answer.toJSON()
    res.render('editform', {answer: answerItem})
})

// Salvar alteracoes e atualizar a resposta
router.post('/saveChanges', (req, res) => {
    Answer.update({title: req.body.title, 
        category: req.body.category,
        answer: req.body.answer}, {where: {
        id: req.body.id
    }}).then(() => {
        res.redirect('/respostas')
    }).catch((e) => {
        console.error('Erro: ', e)
    })
    
})

// Eliminar resposta
router.get('/deleteresp', checkLogin, checkAdmin, async (req, res) => {
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
router.get('/deleteAnswer/:id', checkLogin, checkAdmin, (req, res) => {
    Answer.destroy({where: {'id': req.params.id}}).then(() => {
        res.redirect('/deleteresp')
    }).catch((e) => {
        console.log('Erro: ', e)
    })
    
})

// Rota das respostas
router.get('/respostas', async (req, res) => {
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
router.get('/shower/:id', async (req, res) => {
    answer = await Answer.findByPk(req.params.id)
    content = answer.toJSON()
    res.render('shower', {answer: content})
})


// Rota do Dashboard Adminstrativo
router.get('/admincheck', (req, res) => {
    res.render('login')
})

router.post('/admincheck', async (req, res) => {
    const { username, email, password } = req.body
    const user = await User.findOne({where: {username} })

    if (user && bcrypt.compareSync(password, user.password)){
        req.session.user = {
            id: user.id,
            username: user.username,
            isAdmin: user.isAdmin
        }
        res.redirect('/dashboard')
    } else {
        req.flash('error', 'Credenciais inválidas')
        res.redirect('/admincheck')
    }
    
})

router.get('/dashboard', checkLogin, checkAdmin, async (req, res) => {
    database = await Answer.findAll()
    coutItems = await Answer.count()
    databaseContent = database.map(content => content.toJSON())
    res.render('dashboard', {database: databaseContent, coutItems: coutItems})
})

router.get('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/')
})

module.exports = router

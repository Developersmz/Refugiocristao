require('dotenv').config()

const express = require('express')
const router = express.Router()
const { User, Answer, About } = require('../models/Models');

// Rota inicial
router.get('/', async (req, res) => {
    try{
        const userId = req.session.userId
        let user = null

        if (userId) {
            const checkuser = await User.findByPk(userId)
            user = checkuser ? checkuser.toJSON() : null
        }

        // About content
        const about = await About.findAll()
        const aboutContent = about.map(content => content.toJSON())

        res.render('index', {about: aboutContent, user})
    }
    catch(e){
        console.error('ERRO: ', e)
        res.status(500).send('Erro interno no servidor')
    }
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

module.exports = router
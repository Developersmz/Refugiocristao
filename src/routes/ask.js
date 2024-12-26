const express = require('express')
const router = express.Router()
const { checkLogin, checkAdmin } = require('../../configs/passport')
const { ask } = require('../controllers/askController')
const { QuestionHistory } = require('../models/Models')


router.get('/perguntar', checkLogin, async (req, res) => {
    try {
        const userId = req.session.userId
        const searchedQuestion = req.query.search

        let history

        if (searchedQuestion) {
            history = await QuestionHistory.findAll({
                where: {
                    userId: userId,
                    question: searchedQuestion
                }
            })
        } else {
            history = await QuestionHistory.findAll({ where: { userId: userId } })
        }

        const mappedHistory = history.map(hist => ({
            id: hist.id,
            userId: hist.userId,
            question: hist.question,
            answer: hist.answer
        }))

        res.render('ask', { history: mappedHistory, title: "RefúgioCristão | Perguntar" })
    } catch (error) {
        console.log("ERRO: " + error)
    }
})

router.get('/pergunta/procurar', checkLogin,  async (req, res) => {
    const userId =  req.session.userId
    const question = req.query.query

    try {
        const history = await QuestionHistory.findOne({
            where: {
                userId: userId,
                question: question
            }
        })

        if (history) {
            const results = history.answer
            res.json({ results })
        } else {
            res.status(404).json({ error: 'Nenhum histórico encontrado para essa consulta.' });
        }

    } catch (error) {
        console.error('Erro ao buscar o histórico:', error);
        res.status(500).json({ error: 'Erro ao buscar o histórico.' });
    }
})

router.post('/perguntar', ask)

module.exports = router

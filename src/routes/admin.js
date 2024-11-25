const express = require('express')
const router = express.Router()
const { checkLogin, checkAdmin } = require('../../configs/passport')
const { About, Answer, Book, BookSection } = require('../models/Models')

router.get('/dashboard', checkLogin, checkAdmin, async (req, res) => {
    database = await Answer.findAll()
    coutItems = await Answer.count()
    databaseContent = database.map(content => content.toJSON())
    res.render('dashboard', {database: databaseContent, coutItems: coutItems})
})

router.get('/addBook', (req, res) => {
    res.render('book')
})

router.post('/createBook', async (req, res) => {
    const { title, subtitles, contents } = req.body;

    try {
        // Verificar se o livro já existe
        const existingBook = await Book.findOne({ where: { title } });
        if (existingBook) {
            return res.render('book', { error: "O livro já foi adicionado!" });
        }

        // Criar o livro
        const newBook = await Book.create({ title });

        // Criar as seções do livro
        for (let i = 0; i < subtitles.length; i++) {
            const subtitle = subtitles[i];
            const content = contents[i];

            await BookSection.create({
                bookId: newBook.id,
                subtitle,
                content,
            });
        }

        return res.render('book', { success: "Livro adicionado com sucesso!" });
    } catch (error) {
        console.error("Erro ao adicionar o livro:", error);
        return res.render('book', { error: "Ocorreu um erro ao adicionar o livro. Tente novamente." });
    }
});


// About 
router.get('/about', (req, res) => {
    res.render('about')
})

router.post('/about', (req, res) => {
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
router.get('/addresp', checkLogin, checkAdmin, (req, res) => {
    res.render('addform')
})

router.post('/newAnswer', (req, res) => {
    const { title, category, answer } = req.body;

    Answer.findOne({
        where: {
            title: title
        }
    })
    .then(existingAnswer => {
        if (existingAnswer) {
            // Caso já exista uma resposta com os mesmos dados
            res.render('output', { error: "Resposta já existe na tabela" });
        } else {
            // Caso não exista, cria uma nova resposta
            return Answer.create({
                title,
                category,
                answer
            })
            .then(() => res.redirect('/respostas'))
            .catch(() => res.send('<h1>Erro ao atualizar a tabela</h1>'));
        }
    })
    .catch(() => res.send('<h1>Erro ao verificar a existência da resposta</h1>'));
});

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
        res.send('<h1>Erro ao atualizar a tabela</h1>')
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
        res.redirect('/admin/deleteresp')
    }).catch((e) => {
        res.send('<h1>Erro ao atualizar a tabela</h1>')
    })
    
})

module.exports = router
const express = require('express')
const router = express.Router()
const fs = require('fs/promises')
const markdownIt = require('markdown-it')
const { checkLogin, checkAdmin } = require('../../configs/passport')
const { About, Answer, Book, BookSection } = require('../models/Models')
const upload = require('../../server')
const chunkArray = require('../utils/lotes')
const { sequelize } = require('../../configs/db')

router.get('/dashboard', checkLogin, checkAdmin, async (req, res) => {
    database = await Answer.findAll()
    coutItems = await Answer.count()
    databaseContent = database.map(content => content.toJSON())
    res.render('dashboard', {database: databaseContent, coutItems: coutItems})
})

router.get('/addBook', checkLogin, checkAdmin, (req, res) => {
    res.render('book')
})

router.post('/createBook', upload.single('file'), async (req, res) => {
    let transaction
    
    try {
        const { inputMode, title, subtitles, contents } = req.body;

        if (inputMode === 'manual') {

            if (!title || !Array.isArray(subtitles) || !Array.isArray(contents)) {
                return res.render('book', { error: 'Dados inválidos. Tente novamente.' });                
            }

            if (subtitles.length !== contents.length) {
                return res.render('book', { error: 'Subtítulos e conteúdos devem ter o mesmo número de itens.' })
            }

            const transaction = await sequelize.transaction()

            // Lógica para salvar manualmente
            const book = await Book.create({ title }, { transaction });

            const sections = subtitles.map((subtitle, index) => ({
                bookId: book.id,
                subtitle,
                content: contents[index]
            }))

            await BookSection.bulkCreate(sections, { transaction })

            await transaction.commit();

            return res.render('book', { success: 'Livro criado com sucesso!' });
        } else if (inputMode === 'upload' && req.file) {

            if (!req.file) {
                return res.render('book', { error: 'Nenhum ficheiro recebido!' })
            }

            const transaction = await sequelize.transaction()
            // Lógica para salvar via upload
            const filePath = req.file.path;
            const rawMarkdown = await fs.readFile(filePath, 'utf-8');
            const bookData = parseMarkdown(rawMarkdown);

            const book = await Book.create({ title: bookData.title }, { transaction });
        

            const sections = bookData.sections.map((section) => ({
                bookId: book.id,
                subtitle: section.subtitle,
                content: section.content,
            }));

            const BATCH_SIZE = 200
            const sectionsChunks = chunkArray(sections, BATCH_SIZE)


            for (const chunk of sectionsChunks) {
                await BookSection.bulkCreate(chunk, { transaction })
            }

            await transaction.commit();
            await fs.unlink(filePath);

            return res.render('book', { success: 'Livro criado com sucesso via upload!' });
        } 
    } catch (error) {
        if(transaction) {
            await transaction.rollback();
        }
        console.error(error);
        return res.render('book', { error: 'Erro ao criar o livro: ' + error.message });
    }
});

function parseMarkdown(rawMarkdown) {
    const md = new markdownIt();
    const tokens = md.parse(rawMarkdown, {});
    const bookData = { title: '', sections: [] };

    let currentSection = null;
    tokens.forEach((token, index) => {
        if (token.type === 'heading_open' && token.tag === 'h2') {
            // Captura o título do livro
            const nextToken = tokens[index + 1];
            if (nextToken && nextToken.type === 'inline') {
                bookData.title = nextToken.content;
            }
        } else if (token.type === 'heading_open' && token.tag === 'h3') {
            // Inicia uma nova seção
            if (currentSection) {
                // Adiciona a seção anterior ao array antes de criar uma nova
                bookData.sections.push({ ...currentSection });
            }
            currentSection = { subtitle: '', content: '' };

            const nextToken = tokens[index + 1];
            if (nextToken && nextToken.type === 'inline') {
                currentSection.subtitle = nextToken.content;
            }
        } else if (token.type === 'paragraph_open' && currentSection) {
            // Adiciona o conteúdo ao parágrafo da seção atual
            const nextToken = tokens[index + 1];
            if (nextToken && nextToken.type === 'inline') {
                currentSection.content += `${nextToken.content}\n`;
            }
        }
    });

    // Adiciona a última seção ao array, se houver
    if (currentSection) {
        bookData.sections.push({ ...currentSection });
    }

    return bookData;
}

// About 
router.get('/about', checkLogin, checkAdmin, (req, res) => {
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
const { QueryTypes, Op } = require('sequelize')
const { sequelize } = require('../../configs/db')
const { Book, BookSection, QuestionHistory } = require('../models/Models')

const ask = async (req, res) => {
    const { question } = req.body;
    const userId = req.session.userId;

    if (!question) {
        return res.render('ask', { error: 'Por favor, insira uma pergunta.' });
    }

    try {
        // 1. Verificar se a pergunta já está no histórico
        const existingHistory = await QuestionHistory.findOne({
            where: {
                userId,
                question: {
                    [Op.like]: `%${question}%`, // Busca por perguntas similares
                },
            },
        });

        if (existingHistory) {
            // Se a pergunta já foi feita, retornar a resposta do histórico
            return res.render('ask', {
                question: existingHistory.question,
                answer: existingHistory.answer,
            });
        }

        // 2. Caso não esteja no histórico, buscar no banco de dados (livros)
        const relevantSections = await sequelize.query(
            `SELECT bs.subtitle, bs.content, b.title AS bookTitle,
                MATCH(bs.subtitle, bs.content) AGAINST(:question IN NATURAL LANGUAGE MODE) AS relevance
             FROM BookSections bs
             JOIN Books b ON b.id = bs.bookId
             WHERE MATCH(bs.subtitle, bs.content) AGAINST(:question IN NATURAL LANGUAGE MODE)
             ORDER BY relevance DESC
             LIMIT 2;`,
            {
                replacements: { question },
                type: QueryTypes.SELECT,
            }
        );

        if (!relevantSections.length) {
            return res.render('ask', {
                question,
                error: 'Nenhuma resposta encontrada para sua pergunta.',
            });
        }

        // 3. Montar a resposta com os trechos mais relevantes
        const results = relevantSections.map((section) => ({
            bookTitle: section.bookTitle,
            subtitle: section.subtitle,
            content: truncateContent(section.content, question),
        }));

        // Combinar subtítulos e conteúdos em uma resposta formatada
        const answer = results
            .map(
                (result) =>
                    `Livro: ${result.bookTitle}\nSubtítulo: ${result.subtitle || 'Sem subtítulo'}\nTrecho: ${
                        result.content
                    }\n`
            )
            .join('\n---\n');

        // 4. Salvar a pergunta e resposta no histórico do usuário
        await QuestionHistory.create({
            userId,
            question,
            answer,
        });

        // 5. Retornar a resposta ao usuário
        return res.render('ask', { question, answer });
    } catch (error) {
        console.error('Erro ao processar a pergunta:', error);
        return res.status(500).render('ask', {
            error: 'Erro ao processar a pergunta. Tente novamente mais tarde.',
        });
    }
}

// Função auxiliar para truncar conteúdo
function truncateContent(content, question) {
    const regex = new RegExp(`.{0,100}${question}.{0,100}`, 'i'); 
    const match = content.match(regex);
    return match ? match[0] : content.substring(0, 1000) + '...'; // Retorna trecho relevante ou primeiros 1000 caracteres
}

module.exports = { ask }
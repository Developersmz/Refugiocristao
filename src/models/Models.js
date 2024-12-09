const db = require('../../configs/db')
const { DataTypes, Model } = require('sequelize')
const bcrypt = require('bcryptjs')

const User = db.sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isAdmin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
})

User.beforeCreate(async (user) => {
    const hash = await bcrypt.hash(user.password, 10)
    user.password = hash
})

const About = db.sequelize.define('About', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    text: {
        type: DataTypes.TEXT,
        allowNull: false
    }
})

const Answer = db.sequelize.define('Answer', {
    book: {
        type: DataTypes.STRING,
        allowNull: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false
    },
    answer: {
        type: DataTypes.TEXT,
        allowNull: false
    }
})

const Book = db.sequelize.define('Book', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    
})

const BookSection = db.sequelize.define('BookSection', {
    bookId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Books',
            key: 'id'
        }
    },
    subtitle: {
        type: DataTypes.STRING,
        allowNull: true
    },
    content: {
        type: DataTypes.TEXT('long'),
        allowNull: false
    },
}, {
    indexes: [
        {
            type: 'FULLTEXT',
            fields: ['subtitle', 'content']
        }
    ]
})

const QuestionHistory = db.sequelize.define('QuestionHistory', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    question: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    answer: {
        type: DataTypes.TEXT('long'),
        false: false
    }
})

Book.hasMany(BookSection, { foreignKey: 'bookId', onDelete: 'CASCADE' })
BookSection.belongsTo(Book, { foreignKey: 'bookId' })
QuestionHistory.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' })
User.hasMany(QuestionHistory, { foreignKey: 'userId' })

// db.sequelize.sync({ alter: true })
//     .then(() => {
//         console.log('Banco de dados sincronizado e modelo atualizado.');
//     })
//     .catch((err) => {
//         console.log('Erro ao sincronizar o banco de dados:', err);
//     });

module.exports = { User, About, Answer, Book, BookSection, QuestionHistory }

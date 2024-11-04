const db = require('../../configs/db')
const { DataTypes } = require('sequelize')

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

db.sequelize.sync({ alter: true })
    .then(() => {
        console.log('Banco de dados sincronizado e modelo atualizado.');
    })
    .catch((err) => {
        console.log('Erro ao sincronizar o banco de dados:', err);
    });

module.exports = { User, About, Answer }
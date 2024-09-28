const db = require('./db')
const { DataTypes } = require('sequelize')

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


module.exports = Answer
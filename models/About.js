const db = require('./db')
const { DataTypes } = require('sequelize')

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

About.sync().then(() => console.log("Table was created")).catch((e) => console.log("Erro: ", e))

//module.exports = About
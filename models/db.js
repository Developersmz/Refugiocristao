require('dotenv').config()

const dbCOnfig = require('../configs/configs')
const Sequelize = require('sequelize')

// conecting MySQL database
const sequelize = new Sequelize(dbCOnfig.DB_NAME, dbCOnfig.DB_USER, dbCOnfig.DB_PASSWORD, {
    host: dbCOnfig.DB_HOST,
    dialect: 'mysql'
})

module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize
}
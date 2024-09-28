require('dotenv').config()

const dbCOnfig = require('../configs/configs')
const Sequelize = require('sequelize')

// conecting MySQL database
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  dialect: 'mysql',
})

module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize
}

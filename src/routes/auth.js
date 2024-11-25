const express = require('express')
const router = express.Router()
const { passport } = require('../../configs/passport')
const { User } = require('../models/Models')

// Rota do Dashboard Adminstrativo
router.get('/signin', (req, res) => {
    res.render('signin')
})

router.post('/signin', async (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err)
        }
        if (!user) {
            return res.render('signin', { error: info.message })
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err)
            }
            req.session.userId = user.id
            return res.redirect('/?logged_in=true')
        })
    })(req, res, next)
})

router.get('/signup', (req, res) => {
    res.render('signup')
})

router.post('/signup', async (req, res) => {
    const { name, email, password, confpass } = req.body

    try {
        const thisUserExist = await User.findOne({ where: { email }})
        
        if (thisUserExist) {
            return res.render('signup', { error: "E-mail já registrado." })
        }

        if (password != confpass) {
            return res.render('signup', { error: "Ocorreu um problema na criação da conta, tente novamente." })
        }

        const createUser = await User.create({
            username: name,
            email,
            password
        })

        res.redirect('/')

    } catch (error) {
        res.render('signup', { error: "Erro ao registrar o usuário, tente novamente." })
    }
})

router.get('/signout', (req, res) => {
    req.logout(() => {
        res.redirect('/')
    })
})

module.exports = router
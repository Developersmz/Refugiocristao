const express = require('express')
const router = express.Router()
const { passport } = require('../../configs/passport')

// Rota do Dashboard Adminstrativo
router.get('/admincheck', (req, res) => {
    res.render('login')
})

router.post('/admincheck', async (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err)
        }
        if (!user) {
            return res.render('login', { error: info.message })
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err)
            }
            req.session.user = user.id
            return res.redirect('/')
        })
    })(req, res, next)
})

router.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect('/')
    })
})

module.exports = router
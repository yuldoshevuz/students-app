const express = require('express')
const { engine } = require('express-handlebars')
const path = require('path')
const validate = require('./middlewares/validate')
const session = require('express-session')
const dotenv = require('dotenv')
dotenv.config()
const port = process.env.PORT || 5001
const authCheck = require('./middlewares/auth')
const paymentValidate = require('./middlewares/paymentValidate')
const fs = require('fs')
const users = require('./data/users.json')
const paymentsJson = require('./data/payments.json')
const currencies = require('./data/currencies.json')
const payments = paymentsJson

const app = express()

app.use(session({
    secret: 'KEY',
    resave: false,
    saveUninitialized: true,
    cookie: {
       maxAge: 604800000 // 1 week
    }
}))
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true })  )

app.engine('hbs', engine({
    defaultLayout: path.join(__dirname, 'views', 'layouts', 'main.hbs'),
    partialsDir: path.join(__dirname, 'views', 'partials'),
    extname: 'hbs'
}))

app.set('view engine', 'hbs')

app.get('/', authCheck.isAuth, (req, res) => {
    res.render('home', {
        title: 'Kabinet',
        isHome: true
    })
})

app.get('/groups', authCheck.isAuth, (req, res) => {
    res.render('groups', {
        title: 'Guruhlarim',
        isGroups: true
    })
})

app.get('/payments(/index)?', authCheck.isAuth, (req, res) => {
    res.render('payments/index', {
        title: "To'lovlarim",
        isPayments: true,
        payments,
        isPaymentsPage: true,
        helpers: {
            userName: require('./views/helpers/userName'),
            getFullAmount: require('./views/helpers/getFullAmount'),
            parseDate: require('./views/helpers/parseDate'),
        }
    })
})

app.get('/payments/add', authCheck.isAuth, (req, res) => {
    res.render('payments/add', {
        title: "Yangi to'lov qo'shish",
        isPayments: true,
        users,
        currencies,
        error: req.session.error
    })
    delete req.session.error
})

app.post('/payments/add', authCheck.isAuth, paymentValidate, (req, res) => {
    if (req.session.error) {
        res.redirect('/payments/add')
        return
    }
    payments.push({
        id: payments.length +1,
        user_id: +req.body.studentId,
        type: 'debit',
        amount: +req.body.amount,
        currency: currencies.find(item => item.id === req.body.currencyId).currency,
        created_at: Date.now() / 1000,
        comment: req.body.comment ? req.body.comment : ''
    })

    fs.writeFileSync(path.join(__dirname, 'data', 'payments.json'), JSON.stringify(payments))
    res.redirect('/payments')
})

app.get('/login', authCheck.isntAuth, (req, res) => {
    res.render('login', {
        title: 'Kirish',
        layout: 'login',
        loginVal: req.session.login,
        error: req.session.error,
        users
    })
    delete req.session.error
    delete req.session.login
})

app.post('/login', validate, (req, res) => {
    if (req.session.error) {
        req.session.login = req.body.username
        res.redirect('/login')
        return
    }
    req.session.auth = true
    req.session.username = req.body.username
    if (!req.session.url) {
        res.redirect('/')
        return
    }
    res.redirect(req.session.url)
    delete req.session.url
})

app.get('/logout', authCheck.isAuth, (req, res) => {
    req.session.auth = false
    req.session.username = undefined
    res.redirect('/login')
})

app.listen(5001, () => {
    console.log('Server running on port:', port)
})
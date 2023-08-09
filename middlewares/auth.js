function isAuth(req, res, next) {
    if (!req.session.auth) {
        req.session.url = req.path
        res.redirect('/login')
        return
    }
    next()
}

function isntAuth(req, res, next) {
    if (req.session.auth) {
        res.redirect('/')
        return
    }
    next()
}

module.exports = { isAuth, isntAuth }
const users = require('../data/users.json')

module.exports = validate = (req, res, next) => {
    try {
        const username = req.body.username
        const password = req.body.password

        if (!username || !password) {
            req.session.error = 'Iltimos foydalanuvchi nomi va parolni kiriting'
            next()
            return
        }
        const foundUser = users.find(user => user.username === username.trim())
        if (!foundUser) {
            req.session.error = `Ushbu foydalanuvchi topilmadi`
            next()
            return
        }
        if (password !== foundUser.password) {
            req.session.error = "Iltimos parolni to'g'ri kiriting"
            next()
            return
        }
        next()
    } catch (error) {
        console.log(error);
    }  
}
const users = require('../data/users.json')
const currencies = require('../data/currencies.json')

module.exports = (req, res, next) => {
    const { studentId, amount, currencyId } = req.body

    if (!studentId || studentId === 'null' || !currencyId || currencyId === 'null' ||  !amount) {
        req.session.error = "Iltimos kerakli maydonlarni to'ldiring!"
        next()
        return
    }

    const student = users.find(student => student.id === +studentId)

    if (!student) {
        req.session.error = "Kechirasiz, bunday talaba mavjud emas!"
        next()
        return
    }
    const currency = currencies.find(item => item.id === currencyId)

    if (!currency) {
        req.session.error = "Valyuta topilmadi!"
        next()
        return
    }

    next()
    
}
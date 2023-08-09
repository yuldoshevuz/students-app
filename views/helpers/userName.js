const users = require('../../data/users.json')

module.exports = (id) => {
    const user = users.find(item => item.id === id)
    if (!user) {
        return "No'malum foydalanuvchi"
    }
    return user.full_name
}
module.exports = (data) => {
    const { type, amount } = data.hash

    if (type === 'credit') {
        return `-${amount}`
    } else if (type === 'debit') {
        return `+${amount}`
    }
    return 'Xatolik'
}
const tokenizer = require('./tokenizer')
const parser = require('./parser')
const fgdToJSON = require('./fgdToJSON')
const jsonToFGD = require('./jsonToFGD')

exports.toJSON = input => {
    const tokens = tokenizer(input)
    const rawTokenObject = parser(tokens)
    return fgdToJSON(rawTokenObject)
}
exports.fromJSON = input => {
    return jsonToFGD(input)
}

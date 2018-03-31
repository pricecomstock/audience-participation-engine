const crypto = require('crypto');

generate = (num_bytes) => {// 3 bytes = 4 base 64 characters
    const buf = crypto.randomBytes(num_bytes); 
    return buf.toString('base64').replace(/\//g, '_').replace(/\+/g, '-')
}

generateCaps = (length) => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = ""
    for(var i = 0; i < length; i++) {
        var index = Math.floor(Math.random() * letters.length);
        result = result + letters.charAt(index)
    }
    return result;
}

console.log(generateCaps(4));

module.exports.generate = generate;
module.exports.generateCaps = generateCaps;
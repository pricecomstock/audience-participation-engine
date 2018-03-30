var Gun = require('gun')

var gun = Gun({localStorage: false});

gun.get('users').put({
    name: "Price",
    email: "price.comstock@gmail.com"
})

gun.get('users').on( (data, key) => console.log("update:", data))
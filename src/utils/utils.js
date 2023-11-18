const bcrypt = require("bcrypt")
const { faker } = require('@faker-js/faker');

const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))


const isValidatePassword = (password, user) => bcrypt.compareSync(password, user.password);


 const generateProducts = (numOfProducts) => {
    let products = [];

    for (let i = 0; i < numOfProducts; i++) {
        products.push(generateProduct());
    }

    return products;
};

 const generateProduct = () => {
    return {
        title: faker.commerce.product(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        stock: faker.datatype.number(),
        category: faker.commerce.department()
    };
};




module.exports = {
    createHash,
    isValidatePassword,
    generateProducts
}



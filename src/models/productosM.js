const {Container} = require('./container');
const { knex } = require("../options/mariaDB");

class Productos extends Container {
    constructor(){
        super('productos')
    }
}

const producto1 = new Productos()
const primerProducto = producto1.get(knex);
console.log(primerProducto);


module.exports = {Productos};
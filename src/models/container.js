const fs = require ('fs');
const { knex } = require("../options/mariaDB");
const { knexSqLite3 } = require("../options/sqLite3");

class Container {
    constructor(fileName){
        this.fileName = fileName;
    }

    get(sql){
         return sql(this.fileName)
          .select("*")
          .then((result) => {
            console.log(result);
            return result;
          })
          .catch((err) => {
            console.log(err);
          });
      };
}

module.exports = {Container};
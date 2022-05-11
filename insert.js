const { knex } = require("./options/mariaDB");
const { knexSqLite3 } = require("./options/sqLite3");

insertProducts = (knex, x) => {
  console.log(x);
  let array = [];
  array.push(x);
  array.forEach((element) =>
    knex("Prueba")
      .insert({ title: element.title, price: element.price })
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      })
  );
};

const objeto = { title: "heladera", price: "NO PRICE" };
// LA FUNCION DE ABAJO ES PARA AGREGAR UN ELEMENTO A UNA TABLA YA CREADA
// insertProducts(knexSqLite3, objeto);

// ----------------------------
const createTable = async (knex) => {
  await knexSqLite3.schema.createTable("Historial", (table) => {
    table.integer("id").primary();
    table.string("author");
    table.string("text");
  });
};

// createTable(knex);
// createTable(knexSqLite3)

const getProducts = (knexSqLite) => {
  knexSqLite("Historial")
    .select("*")
    .then((result) => {
      console.log(result);
    })
    .catch((err) => {
      console.log(err);
    });
};

// getProducts(knexMysql);
getProducts(knexSqLite3);
console.log(getProducts(knexSqLite3));

module.exports = { insertProducts };

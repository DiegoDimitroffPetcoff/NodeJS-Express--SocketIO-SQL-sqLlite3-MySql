const {knex}= require('./options/sqLite3');



insertProducts = (knex, x) => {
    console.log(x);

    let array = [];
    array.push(x);

    array.forEach((element) =>
      knex("productos")
        .insert({ title: element.title, price: element.price })
        .then((result) => {
          console.log(result);
        })
        .catch((err) => {
          console.log(err);
        })
    );
  };


  module.exports={insertProducts};

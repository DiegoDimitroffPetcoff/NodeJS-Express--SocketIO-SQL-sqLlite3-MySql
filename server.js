const express = require("express");
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");
const fs = require("fs");
const { knex } = require("./options/mariaDB");
const { knexSqLite3 } = require("./options/sqLite3");
// const {insertProducts}= require('./insert');
const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

const multer = require("multer");
const handlebars = require("express-handlebars");
const { log } = require("console");
const { Knex } = require("knex");
const { text } = require("express");
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine(
  "hbs",
  handlebars.engine({
    extname: ".hbs",
    defaultLayout: "index.hbs",
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "/views/partials/",
  })
);

app.set("view engine", "hbs");
app.set("views", "./views");
app.use(express.static("./public"));

let storage = multer.diskStorage({
  destination: function (req, res, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

const upload = multer({ storage: storage });

// _________________________________________________________________________
class Contenedor {
  constructor() {
    this.route = "./productos.txt";
    this.id = 1;
  }

  insertProducts = async (knex, x) => {
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

  saveChat(knexSqLite3, x) {
    // si no existe tabla tiene que pasar esto
    // const createTable = async (knex) => {
    //   await knexSqLite3.schema.createTable("Historial", (table) => {
    //     table.integer("id").primary();
    //     table.string("author");
    //     table.string("text");
    //   });
    // };
    // si existe tabla debe suceder esto:

    x.forEach((element) =>
       knexSqLite3("Historial")
        .insert({ author: element.author, text: element.text })
        .then((result) => {
          console.log(result);
          return result
          
        })
        .catch((err) => {
          console.log(err);
        })
    );
  }

  getProducts =  (knexSqLite) => {
    return knexSqLite("Historial")
      .select("*")
      .then((result) => {
        console.log(result);
        return result;
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // -----------------------------------------------------------------------------

  getById(x) {
    let array = [];
    let y = x;
    try {
      let data = fs.readFileSync(this.route, "utf-8");
      array = JSON.parse(data);
    } catch {
      console.log("catch error");
    }
    let object = null;

    array.forEach((element) => {
      if (element.id == y) {
        object = element;
      }
    });

    if (object == null || object == undefined || object == false) {
      object = "Error, producto no encontrado";
    }
    return object;
  }

  deleteById(x) {
    let array = [];
    let y = x;
    try {
      let data = fs.readFileSync(this.route, "utf-8");
      array = JSON.parse(data);
      console.log("Ingreso por TRY");
    } catch {
      console.log("catch error");
    }

    array.forEach((element) => {
      if (element.id == y) {
        let id = element.id - 1;
        let removed = array.splice(id, 1);
        console.log("ELEMENTO ELIMINADO: " + JSON.stringify(removed));
        fs.writeFileSync(this.route, JSON.stringify(array));
        console.log(array);
      }
    });
  }

  edit(id, nombre, price) {
    let y = id;
    let readFinal = fs.readFileSync(this.route, "utf-8");
    let allProducts = JSON.parse(readFinal);

    console.log(allProducts);

    allProducts.forEach((element) => {
      if (element.id == y) {
        element.title = nombre;
        element.price = price;
      }
    });
    console.log(allProducts);
    fs.writeFileSync(this.route, JSON.stringify(allProducts));
    return allProducts;
  }

  read = () => {
    return knex("productos")
      .select("*")
      .then((result) => {
        //  console.log(result);
        return result;
      })
      .catch((err) => {
        console.log(err);
      });
  };
}

const contenedor = new Contenedor();

class NuevoObjeto {
  constructor(title, price) {
    this.title = title;
    this.price = price;
  }
}

// __________________________________________________________________________
const messages = [];
const chat = [];

io.on("connection", async (socket) => {
  console.log("Cliente en la Home de la web");

  let prueba = await contenedor.read();

  socket.emit("messages", prueba);

  socket.on("new-message", (data1) => {
    contenedor.insertProducts(knex, data1);

    prueba.push(data1);

    io.sockets.emit("messages", prueba);
  });
});

// ------------------------------------------------------------------------------

io.on("connection",  async (socket) => {
  console.log("Usuario conectado al Chat");

//  por que historial queda como promesa y no se ejecuta?
  let chat = await contenedor.getProducts(knexSqLite3);
  
  
  socket.emit("chat", chat);

  



// lod e abajo se ejecuta cuando escribo en el chat
  socket.on("newChat", (data) => {
    // Date(data);
console.log(data);
    // contenedor.saveChat(data);








    chat.push(data);
    contenedor.saveChat(knexSqLite3, chat);

    io.sockets.emit("chat", chat);
  });
});

app.get("/", function (req, res) {
  res.render("main", { root: __dirname });
});
app.get("/about", function (req, res) {
  res.render("about", { root: __dirname });
});

const server = httpServer.listen(8080, () => {
  console.log("Server " + PORT + " is reading rigth now");
});

// contenedor.insertProducts(knex, prueba);

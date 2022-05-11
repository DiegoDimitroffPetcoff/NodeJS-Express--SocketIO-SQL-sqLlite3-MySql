const express = require("express");
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");
const fs = require("fs");

const {Productos} = require('./src/models/productosM');

const { knex } = require("./src/options/mariaDB");
const { knexSqLite3 } = require("./src/options/sqLite3");

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

const multer = require("multer");
const handlebars = require("express-handlebars");
// const { log } = require("console");
// const { Knex } = require("knex");
// const { text } = require("express");
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
class Contenedor extends Productos {
  

    getChat = (knexSqLite) => {
      return knexSqLite("Historial")
        .select("*")
        .then((result) => {
          // console.log(result);
          return result;
        })
        .catch((err) => {
          console.log(err);
        });
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
            // console.log(result);
            return result;
          })
          .catch((err) => {
            console.log(err);
          })
      );
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

}
 // __________________________________________________________________________

const contenedor = new Contenedor();









// __________________________________________________________________________
io.on("connection", async (socket) => {
  console.log("Cliente en la Home de la web");
  let prueba = await contenedor.get(knex);
  socket.emit("messages", prueba);
  socket.on("new-message", (data1) => {
    contenedor.insertProducts(knex, data1);
    prueba.push(data1);
    io.sockets.emit("messages", prueba);
  });
});

io.on("connection", async (socket) => {
  console.log("Usuario conectado al Chat");
  let chat = await contenedor.getChat(knexSqLite3);
  socket.emit("chat", chat);
  socket.on("newChat", (data) => {
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

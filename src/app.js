const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const PORT = 8080;
const expressHbs = require("express-handlebars");
require("./database");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport"); 
const initializePassport = require("./config/passport.config");
const path = require('path');

//Routers
const productsRouter = require("./routes/products.router");
const cartRouter = require("./routes/carts.router");
const viewsRouter = require("./routes/views.router");
const userRouter = require("./routes/user.router");

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(session({
    secret: "secretSecret",
    resave: false,
    saveUninitialized: true,

    store: MongoStore.create({
        mongoUrl: "mongodb+srv://OctavioMRU:KCf5CDDJXf8UNCcu@cluster0.mnkh0d2.mongodb.net/7_Components?retryWrites=true&w=majority&appName=Cluster0", //URL del servidor para que se la base de datos con se guardara el registro de sessiones
        ttl: 10,
    })
}));

//Implementando passport
app.use(passport.initialize());
initializePassport();
app.use(passport.session());

//AuthMiddleware
const authMiddleware = require("./middleware/authmiddleware.js");
app.use(authMiddleware);

//Routes
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);
app.use("/api/users", userRouter);
app.use("/",viewsRouter)

//Handlebars
app.engine("handlebars", expressHbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

const httpServer = app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});

const SocketManager = require("./sockets/socketManager");
new SocketManager(httpServer);
import express from "express";
import MongoStore from 'connect-mongo';
import morgan from "morgan";
import session from 'express-session';
import passport from "passport";
import { Server } from 'socket.io';
import { routerProducts } from "./routes/productsRouters.js";
import { connectMongo } from "./utils/connections.js";
import { routerCarts } from "./routes/cartsRouter.js";
import handlebars from 'express-handlebars';
import { __dirname } from "./utils.js";
import { productsHtml } from "./routes/productsHtml.js";
import { cartstsHtml } from "./routes/cartsHtml.js";
import { loginRouter } from "./routes/login.router.js";
import { viewsRouter } from "./routes/views.routers.js";
import { iniPassport } from "./config/passportConfig.js";
import dotenv from "dotenv";
import { MsgModel } from "./DAO/Mongo/models/chat.model.js";
import { routerVistaChatSocket } from "./routes/chat-vista-router.js";
import errorHandler from "./middlewares/error.js";
import { routerMocking } from "./routes/mockingproducts.router.js";
dotenv.config();

connectMongo();
const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    store: MongoStore.create({ mongoUrl:'mongodb+srv://admin:F3wBDRmov2yob7pt@ecommerce.eq2fgne.mongodb.net/ecommerce?retryWrites=true&w=majority', ttl: 7200 }),
    secret: 'un-re-secreto',
    resave: true,
    saveUninitialized: true,
  })
);
iniPassport();
app.use(passport.initialize());
app.use(passport.session());

app.engine('handlebars',handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine","handlebars");

app.use(express.static(__dirname + "/public"));
console.log(__dirname + '/public')
app.use(morgan('dev'));

// Rutas: API REST con Json
app.use('/api/products', routerProducts);
app.use('/api/carts', routerCarts);

//Rutas : HTML render
app.use('/products',productsHtml);
app.use('/carts',cartstsHtml);
//chat-socket
app.use('/vista/chat', routerVistaChatSocket);

//rutas-session
app.use('/api/sessions',loginRouter);
/* app.use('/api/sessions/current', (req, res) => {
  console.log(req.session.user)
  return res.status(200).json({
    status: 'success',
    msg: 'datos de la session',
    payload: req.session.user || {},
  });
}); */
app.use('/', viewsRouter);

app.use('/mockingproducts', routerMocking)
app.use(errorHandler);

const httpServer = app.listen(port, () => {
    console.log(`listening on http://localhost:${port}`);
  });

const socketServer = new Server(httpServer);
socketServer.on('connection', (socket) => {
  console.log('Cliente conectado');
  socket.on('msg_front_to_back', async (msg) => {
    console.log(msg)
    const msgCreated = await MsgModel.create(msg);
    console.log(msgCreated)
    const msgs = await MsgModel.find({});
    console.log(msgs)
    socketServer.emit('todos_los_msgs', msgs);
  });
});
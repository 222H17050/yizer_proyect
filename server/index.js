import express from "express";
import { PORT } from "./config.js"
import cors from 'cors'
import indexRoutes from './routes/index.routes.js'
import orderRoutes from './routes/order.routes.js'
import productsRoutes from './routes/products.routes.js'
import adminRoutes from './routes/admins.routes.js'
import clientRoutes from './routes/clients.routes.js'

const app = express();

app.use(cors())
app.use(express.json())

app.use(indexRoutes);
app.use(orderRoutes)
app.use(productsRoutes)
app.use(adminRoutes)
app.use(clientRoutes)

app.listen(PORT);
console.log(`Se esta ejecutando en el puerto ${PORT}`);
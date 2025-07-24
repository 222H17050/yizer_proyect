import express from "express";
import {PORT} from "./config.js"

import indexRoutes from './routes/index.routes.js'
import orderRoutes from './routes/order.routes.js'
import productsRoutes from './routes/products.routes.js'

const app =  express();

app.use(express.json())

app.use(indexRoutes);
app.use(orderRoutes)
app.use(productsRoutes)

app.listen(PORT);
console.log(`Se esta ejecutando en el puerto ${PORT}`);
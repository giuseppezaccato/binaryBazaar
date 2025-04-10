import cors from 'cors'
import express from 'express'
import handleImagePath from './middlewares/handlerPath.js';

const app = express()
const port = process.env.SERVER_PORT || 3000;
const endpoint = process.env.FRONTEND_PORT

import productRouter from './routers/productRouter.js'
import orderRouter from './routers/orderRouter.js'

//cors
app.use(cors({
    origin: process.env.FRONTEND_PORT
}))

//middleware body parse
app.use(express.json())

//middleware gestionePathIMG
app.use(handleImagePath)

//middleware asset statico
app.use(express.static('public'))

//mount productRouter
app.use('/products', productRouter)

//mount orderRouter
app.use('/orders', orderRouter)


//attivazione del server
app.listen(port, () => {
    console.log(`server in funzione sulla porta: ${port}`)
})

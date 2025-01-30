import express from 'express'
import cors from 'cors'
import routes from './routes'
import 'dotenv/config'
import connectDB from './config/db'
import corsConfig from './config/cors'

connectDB()

const app = express()

//Cors
app.use(cors( corsConfig ))

//Leer datos del formulario
app.use( express.json() )

app.use('/', routes)


export default app

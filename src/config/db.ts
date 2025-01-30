import mongoose from 'mongoose'
import {exit} from 'node:process'
import colors from 'colors'

const connectDB = async () => {
    const url = process.env.DB_URL
    try {
        const { connection } = await mongoose.connect(url)
        console.log (
            colors.blue.bold(`Base de datos conectada en ${connection.host}:${connection.port}`)
        )
    } catch (error) {
        console.log (
            colors.red(`Hubo un error al conectar la base de datos, msg: ${error.message}`)
        )
        exit(1)
    }
}

export default connectDB
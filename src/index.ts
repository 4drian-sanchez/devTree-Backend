import colors from 'colors'
import app from './server'

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
    console.log(colors.magenta(`Servidor funcionando en el puerto ${PORT}`) )
})
import { CorsOptions } from 'cors'

const corsConfig: CorsOptions = {
    origin: function (origin, cb) {
        const whiteList = [process.env.FRONT_URL]
        if (process.argv[2] === '--api') {
            whiteList.push(undefined)
        }

        if (whiteList.includes(origin)) {
            cb(null, true)
        } else {
            cb(new Error('Error de cors'))
        }
    }
}
export default corsConfig
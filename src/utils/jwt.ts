import jwt, { JwtPayload } from 'jsonwebtoken'

const generateJWT = (payload: JwtPayload) => {
    return jwt.sign(payload, process.env.JWT_SECRECT, {
        expiresIn: '180d'
    })
}

export default generateJWT
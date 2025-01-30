import { Request, Response, NextFunction } from "express"
import jwt from 'jsonwebtoken'
import User, { IUser } from "../models/User"

declare global {
    namespace Express {
        interface Request {
            user: IUser
        }
    }
}

const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    //Comprobamos si el usuario tiene un bearer token 
    const bearer = req.headers.authorization
    
    if(!bearer || bearer.split(' ').includes('null')) {
        const error = new Error('Accion no válida')
        res.status(409).json({error: error.message})
        return
    }
    const [, token] = bearer.split(' ')
    const result = jwt.verify(token, process.env.JWT_SECRECT)
    
    if(typeof result === 'object' && result.id) {
        try {
            const user = await User.findById(result.id).select('-password')
            if(!user) {
                const error = new Error('Token invalido')
                res.status(404).json({error: error.message})
                return
            }

            req.user = user
            next()
        } catch (error) {
            res.status(500).json({error: 'no autorizado'})
        }
    }
}

export default authenticate
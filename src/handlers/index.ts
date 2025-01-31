import { Request, Response } from "express";
import jwt from 'jsonwebtoken'
import User from "../models/User";
import slug from 'slug'
import { comparePassword, hashPassword } from "../utils/bcrypt";
import generateJWT from "../utils/jwt";
import cloudinary from "../config/cloudinary";
import formidable from 'formidable'

class UserController {
    static createUser = async (req: Request, res: Response) => {
        try {
            const { email } = req.body


            const userExists = await User.findOne({ email })
            if (userExists) {
                const error = new Error('Email no disponible, por favor intente con otro')
                res.status(409).json({ error: error.message })
                return
            }

            const handle = slug(req.body.handle)
            const handleExists = await User.findOne({ handle })

            if (handleExists) {
                const error = new Error('El nombre de usuario no esta disponible')
                res.status(409).json({ error: error.message })
                return
            }

            const user = new User(req.body)
            user.handle = await handle
            user.password = await hashPassword(user.password)
            await user.save()
            res.status(201).send('Usuario creado correctamente')

        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }
    }

    static login = async (req: Request, res: Response) => {
        const { email, password } = req.body

        const user = await User.findOne({ email })
        if (!user) {
            const error = new Error('El usuario no existe')
            res.status(404).json({ error: error.message })
            return
        }

        //Comprobando si el usuario existe
        const passwordVerify = await comparePassword(password, user.password)
        if (!passwordVerify) {
            const error = new Error('Contraseña incorrecta')
            res.status(404).json({ error: error.message })
            return
        }
        res.send(generateJWT({id: user._id}))
    }

    static getUser = async (req: Request, res: Response) => { 
        res.status(200).json({user: req.user})
    }

    static updateProfile =  async (req: Request, res: Response) => { 
        try {

        const handle = slug(req.body.handle)
        const handleExists = await User.findOne({ handle })

        if (handleExists && handleExists.handle !== req.user.handle) {
            const error = new Error('El nombre de usuario no esta disponible')
            res.status(409).json({ error: error.message })
            return
        }

        req.user.handle = handle
        req.user.description = req.body.description
        req.user.links = req.body.links
        
        await req.user.save()
        res.send('usuario actualizado')

        } catch (e) {
            const error = new Error('Accion no válida CATCH!')
            res.status(500).json({error: error.message})
        }
    }

    static uploadImage = async (req: Request, res: Response) => {
        const form = formidable({multiples: false})
        
        try {
            form.parse(req, (error, fields, files) => {

                cloudinary.uploader.upload( files.file[0].filepath, {}, async function(error, result) {
                    if(error) {
                        const error = new Error('Hubo un error al subir la imagen')
                        res.status(500).json({error: error.message})
                        return
                    }
                    if(result) {
                        req.user.image = result.secure_url
                        await req.user.save()
                        res.status(200).json({image: result.secure_url })
                    }
                })
            })
            
        } catch (e) {
            const error = new Error('Accion no válida CATCH!')
            res.status(500).json({error: error.message})
        }
    }

    static getUserByHandle =  async (req: Request, res: Response) => { 
        try {
            const {handle} = req.params
            const user = await User.findOne({handle}).select('-password -email -v -_id')
            if(!user) {
                const error = new Error('Usuario no registrado')
                res.status(404).json({error: error.message})
                return
            }
            res.json(user)
        } catch (e) {
            const error = new Error('Accion no válida CATCH!')
            res.status(500).json({error: error.message})
        }
    }

    static getHandle = async (req: Request, res: Response) => { 
        const { handle } = req.body
        try {    
            const handleExists = await User.findOne({handle})
            if(handleExists) {
                const error = new Error(`El ${handle} ya está registrado`)
                res.status(409).json({error: error.message})
                return
            }
            res.send(`EL ${handle} esta disponible`)
        } catch (e) {
            const error = new Error('Error en el search')
            res.status(500).json({error: error.message})
        }
    }
}

export default UserController
import { Router } from 'express'
import UserController from './handlers'
import { body } from 'express-validator'
import validationInputsErrors from './middlewares/validationInputsErrors'
import authenticate from './middlewares/authenticate'

const router = Router()

router.post('/auth/register',
    body('handle')
        .notEmpty()
        .withMessage('El nombre no puede ir vacio'),
    body('name')
        .notEmpty()
        .withMessage('El nombre no puede ir vacio'),
    body('email')
        .isEmail()
        .withMessage('El E-mail no es válido'),
    body('password')
        .isLength({ min: 8 })
        .withMessage('El password debe tener almenos 8 caracteres'),
    validationInputsErrors,
    UserController.createUser
)

router.post('/auth/login',
    body('email')
        .isEmail()
        .withMessage('El E-mail no es válido'),
    body('password')
        .notEmpty()
        .withMessage('El password no puede ir vacio'),
    validationInputsErrors,
    UserController.login
)

router.get('/user',
    authenticate,
    UserController.getUser
)

router.patch('/user',
    authenticate,
    body('handle')
        .notEmpty()
        .withMessage('El handle no puede ir vacio'),
    body('description')
        .notEmpty()
        .withMessage('La descripcion no puede ir vacia'),
    validationInputsErrors,
    UserController.updateProfile
)

router.post('/user/image',
    authenticate,
    UserController.uploadImage
)

export default router
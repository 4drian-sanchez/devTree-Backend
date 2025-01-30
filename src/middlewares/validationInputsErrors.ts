import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

const validationInputsErrors = (req: Request, res: Response, next: NextFunction) => {
    let result = validationResult(req)
    if (!result.isEmpty()) {
        res.json({ errors: result.array() })
        return
    }
    next()
}

export default validationInputsErrors
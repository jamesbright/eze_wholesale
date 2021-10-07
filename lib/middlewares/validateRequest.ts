import * as Joi from 'joi';
import { Request, Response } from 'express';

export default function validateRequest(req: Request, res: Response, next: any): any {

    //destructure request and store it in body variable
    const { body } = req;

    //define validation rules for regitration
    const requestSchema = Joi.object().keys({
        item: Joi.string().required(),
        storageSize: Joi.string().required(),
        grading: Joi.string().required(),
        unlocked: Joi.boolean().required(),
        price: Joi.number().required(),

        
    });

    //perform validation
    const result = requestSchema.validate(body);

    // destructure result of validation into its' value and errors
    const { value, error } = result;

    const valid = error == null;


    //if there are errors return an error message
    if (!valid) {
        return res.status(422).send({ status: 'invalid request', code: 422, message: error });

    } else {

        //if there are no errors push request forward
        next();
    }

}
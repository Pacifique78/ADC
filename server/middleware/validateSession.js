import createSessionSchema from '../joiSchemas/createSessionSchema';
import Joi from '@hapi/joi';
export const validateSession = (req, res, next) =>{
    const  schemasValidation=Joi.validate(req.body, createSessionSchema);
    if(schemasValidation.error){
        const validationErrors=[];
        for(let i=0; i<schemasValidation.error.details.length;i++){
            validationErrors.push(schemasValidation.error.details[i].message.split('"').join(" "));
        }
        return res.status(400).json({
            status: 400,
            error: validationErrors[0]
        });
    }
    next();
}
import Joi from '@hapi/joi';

export const validateUserParams = (req, res, next) =>{
    const userValidationParams = {
        userId: Joi.number().required()
    }
    const schemaValidation = Joi.validate(req.params, userValidationParams)
    if(schemaValidation.error){
        const validationErrors=[];
        for(let i=0; i<schemaValidation.error.details.length;i++){
            validationErrors.push(schemaValidation.error.details[i].message.split('"').join(" "));
        }
        return res.status(400).json({
            status: 400,
            error: validationErrors[0]
        });
    }
    next()
}

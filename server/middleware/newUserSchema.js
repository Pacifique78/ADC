import createUserSchema from '../joiSchemas/createUserSchema';
import Joi from '@hapi/joi';

const checkUser = (req, res, next) => {
    const  schemasValidation=Joi.validate(req.body, createUserSchema);
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
    next()
}
export default checkUser;
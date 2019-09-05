import Joi from '@hapi/joi';


const loginUserSchema = {
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
    password: Joi.string().required()
}
export default loginUserSchema;
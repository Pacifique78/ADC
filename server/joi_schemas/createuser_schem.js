import Joi from '@hapi/joi';

const createUserSchema={
    fName: Joi.string().required(),
    lName: Joi.string().required(),
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
    password: Joi.string().required(),
    status: Joi.string().required()
};
export default createUserSchema;
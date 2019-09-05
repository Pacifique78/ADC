import Joi from '@hapi/joi';

const createUserSchema={
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
    password: Joi.string().required(),
    status: Joi.string().required(),
    address: Joi.string().required(),
    bio: Joi.string().required(),
    occupation: Joi.string().required(),
    expertise: Joi.string().required()
};
export default createUserSchema;
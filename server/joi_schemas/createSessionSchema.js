import Joi from '@hapi/joi';


const createSessionSchema = {
    mentorId:Joi.number().integer().required(),
    questions:Joi.string().required()
}
export default createSessionSchema;
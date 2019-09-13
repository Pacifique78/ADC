import Joi from '@hapi/joi';


const createSessionSchema = {
    score:Joi.number().integer().min(1).max(5).required(),
    remark:Joi.string().required()
}
export default createSessionSchema;
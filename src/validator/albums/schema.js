import Joi from 'joi'

const schema = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().required()
})

export default schema

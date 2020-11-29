import * as yup from 'yup'

export const outgoingSchema = yup.object().shape({
  description: yup.string().required(),
  value: yup.number().required().typeError('Must be a number'),
})

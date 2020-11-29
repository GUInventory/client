import * as yup from 'yup'

export const createSchema = yup.object().shape({
  name: yup.string().required(),
  image: yup.string().required(),
  value: yup.number().required().typeError('Must be a number'),
  positionX: yup.number().required().typeError('Must be a number'),
  positionY: yup.number().required().typeError('Must be a number'),
  positionZ: yup.number().required().typeError('Must be a number'),
  sizeX: yup.number().required().typeError('Must be a number'),
  sizeY: yup.number().required().typeError('Must be a number'),
  sizeZ: yup.number().required().typeError('Must be a number'),
})

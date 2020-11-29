import * as yup from 'yup'

export const updateSchema = yup.object().shape({
  name: yup.string(),
  image: yup.string(),
  value: yup.number().typeError('Must be a number'),
  positionX: yup.number().typeError('Must be a number'),
  positionY: yup.number().typeError('Must be a number'),
  sizeX: yup.number().typeError('Must be a number'),
  sizeY: yup.number().typeError('Must be a number'),
  sizeZ: yup.number().typeError('Must be a number'),
})

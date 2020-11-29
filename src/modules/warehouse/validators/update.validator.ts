import * as yup from 'yup'

export const updateSchema = yup.object().shape({
  name: yup.string(),
  sizeX: yup.number().typeError('Must be a number'),
  sizeY: yup.number().typeError('Must be a number'),
  sizeZ: yup.number().typeError('Must be a number'),
})

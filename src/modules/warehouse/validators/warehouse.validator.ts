import * as yup from 'yup'

export const warehouseSchema = yup.object().shape({
  name: yup.string().required(),
  sizeX: yup.number().required().typeError('Must be a number'),
  sizeY: yup.number().required().typeError('Must be a number'),
  sizeZ: yup.number().required().typeError('Must be a number'),
})

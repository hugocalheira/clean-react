import { FieldValidationSpy } from '@/validation/validators/test'
import { ValidationComposite } from './validation-composite'

type SutTypes = {
  sut: ValidationComposite
  fieldValidationsSpy: FieldValidationSpy[]
}

const makeSut = (additionalValidationsSpy: FieldValidationSpy[] = []): SutTypes => {
  const fieldValidationsSpy = [
    new FieldValidationSpy('any_field'),
    ...additionalValidationsSpy
  ]
  const sut = new ValidationComposite(fieldValidationsSpy)
  return {
    sut,
    fieldValidationsSpy
  }
}

describe('ValidationComposite', () => {
  test('Should return error if any validation fails', () => {
    const { sut, fieldValidationsSpy } = makeSut([new FieldValidationSpy('any_field')])
    fieldValidationsSpy[0].error = new Error('first_error_message')
    fieldValidationsSpy[1].error = new Error('second_error_message')
    const error = sut.validate('any_field', 'any_value')
    expect(error).toBe('first_error_message')
  })

  test('Should return falsy if no validation fails', () => {
    const { sut } = makeSut()
    const error = sut.validate('any_field', 'any_value')
    expect(error).toBeFalsy()
  })
})

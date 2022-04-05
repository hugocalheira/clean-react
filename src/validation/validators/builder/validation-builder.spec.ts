import { ValidationBuilder as sut } from './validation-builder'
import { RequiredFieldValidation, EmailValidation, MinLengthValidation } from '@/validation/validators'

describe('ValidationBuilder', () => {
  test('Should return RequiredFieldValidation', () => {
    const validations = sut.field('any_field').required().build()
    expect(validations).toEqual([new RequiredFieldValidation('any_field')])
  })

  test('Should return EmailValidation', () => {
    const validations = sut.field('any_field').email().build()
    expect(validations).toEqual([new EmailValidation('any_field')])
  })

  test('Should return MinLengthValidation', () => {
    const MIN_LENGTH = 5
    const validations = sut.field('any_field').min(MIN_LENGTH).build()
    expect(validations).toEqual([new MinLengthValidation('any_field', MIN_LENGTH)])
  })

  test('Should return a list of FieldValidations', () => {
    const MIN_LENGTH = 5
    const validations = sut.field('any_field').required().min(MIN_LENGTH).email().build()
    expect(validations).toEqual([
      new RequiredFieldValidation('any_field'),
      new MinLengthValidation('any_field', MIN_LENGTH),
      new EmailValidation('any_field')
    ])
  })
})

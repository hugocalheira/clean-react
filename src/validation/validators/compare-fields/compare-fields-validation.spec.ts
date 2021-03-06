import { InvalidFieldError } from '@/validation/errors'
import faker from '@faker-js/faker'
import { CompareFieldsValidation } from './compare-fields-validation'

const makeSut = (field: string, fieldToCompare: string): CompareFieldsValidation => new CompareFieldsValidation(field, fieldToCompare)

describe('CompareFieldsValidation', () => {
  test('Shoud return error if compare is invalid', () => {
    const field = faker.database.column()
    const fieldToCompare = faker.database.collation()
    const sut = makeSut(field, fieldToCompare)
    const error = sut.validate({
      [field]: faker.random.words(3),
      [fieldToCompare]: faker.random.words(4)
    })
    expect(error).toEqual(new InvalidFieldError())
  })

  test('Shoud return falsy if compare is valid', () => {
    const field = faker.database.column()
    const fieldToCompare = faker.database.collation()
    const value = faker.random.words()
    const sut = makeSut(field, fieldToCompare)
    const error = sut.validate({ [field]: value, [fieldToCompare]: value })
    expect(error).toBeFalsy()
  })
})

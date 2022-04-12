import { InvalidFieldError } from '@/validation/errors'
import faker from '@faker-js/faker'
import { CompareFieldsValidation } from './compare-fields-validation'

const makeSut = (valueToCompare: string): CompareFieldsValidation => new CompareFieldsValidation(faker.database.column(), valueToCompare)

describe('CompareFieldsValidation', () => {
  test('Shoud return error if compare is invalid', () => {
    const sut = makeSut(faker.random.words())
    const error = sut.validate(faker.random.words())
    expect(error).toEqual(new InvalidFieldError())
  })
})
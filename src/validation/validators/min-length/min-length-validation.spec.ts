import { InvalidFieldError } from '@/validation/errors'
import faker from '@faker-js/faker'
import { MinLengthValidation } from './min-length-validation'

const MIN_LENGTH = 8
const INVALID_LENGTH = MIN_LENGTH - 1
const makeSut = (field: string): MinLengthValidation => new MinLengthValidation(field, MIN_LENGTH)

describe('MinLengthValidation', () => {
  test('Should return error if value is invalid', () => {
    const field = faker.database.column()
    const sut = makeSut(field)
    const error = sut.validate({ [field]: faker.random.alphaNumeric(INVALID_LENGTH) })
    expect(error).toEqual(new InvalidFieldError())
  })

  test('Should return falsy if value is valid', () => {
    const field = faker.database.column()
    const sut = makeSut(field)
    const error = sut.validate({ [field]: faker.random.alphaNumeric(MIN_LENGTH) })
    expect(error).toBeFalsy()
  })

  test('Should return falsy if field does not exists in schema', () => {
    const sut = makeSut(faker.database.column())
    const error = sut.validate({ [faker.database.column()]: faker.random.alphaNumeric(MIN_LENGTH) })
    expect(error).toBeFalsy()
  })
})

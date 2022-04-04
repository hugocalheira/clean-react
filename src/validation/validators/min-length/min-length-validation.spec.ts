import { InvalidFieldError } from '@/validation/errors'
import faker from '@faker-js/faker'
import { MinLengthValidation } from './min-length-validation'

const MIN_LENGTH = 8
const INVALID_LENGTH = MIN_LENGTH - 1
const makeSut = (): MinLengthValidation => new MinLengthValidation(faker.database.column(), MIN_LENGTH)

describe('MinLengthValidation', () => {
  test('Should return error if value is invalid', () => {
    const sut = makeSut()
    const error = sut.validate(faker.random.alphaNumeric(INVALID_LENGTH))
    expect(error).toEqual(new InvalidFieldError())
  })

  test('Should return falsy if value is valid', () => {
    const sut = makeSut()
    const error = sut.validate(faker.random.alphaNumeric(MIN_LENGTH))
    expect(error).toBeFalsy()
  })
})

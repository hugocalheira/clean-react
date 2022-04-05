import { FieldValidationSpy } from '@/validation/validators/test'
import faker from '@faker-js/faker'
import { ValidationComposite as Composite } from './validation-composite'

type SutTypes = {
  sut: Composite
  fieldValidationsSpy: FieldValidationSpy[]
}

const makeSut = (fieldName: string, additionalValidationsSpy: FieldValidationSpy[] = []): SutTypes => {
  const fieldValidationsSpy = [
    new FieldValidationSpy(fieldName),
    ...additionalValidationsSpy
  ]
  const sut = Composite.build(fieldValidationsSpy)
  return {
    sut,
    fieldValidationsSpy
  }
}

describe('ValidationComposite', () => {
  test('Should return error if any validation fails', () => {
    const fieldName = faker.database.column()
    const { sut, fieldValidationsSpy } = makeSut(fieldName, [new FieldValidationSpy(fieldName)])
    const errorMessage = faker.random.words()
    fieldValidationsSpy[0].error = new Error(errorMessage)
    fieldValidationsSpy[1].error = new Error(faker.random.words())
    const error = sut.validate(fieldName, faker.random.word())
    expect(error).toBe(errorMessage)
  })

  test('Should return falsy if no validation fails', () => {
    const fieldName = faker.database.column()
    const { sut } = makeSut(fieldName)
    const error = sut.validate(fieldName, faker.random.word())
    expect(error).toBeFalsy()
  })
})

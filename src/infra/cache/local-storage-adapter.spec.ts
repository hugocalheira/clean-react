import { LocalStorageAdapter } from './local-storage-adapter'
import faker from '@faker-js/faker'
import 'jest-localstorage-mock'

const makeSut = (): LocalStorageAdapter => new LocalStorageAdapter()

describe('LocalStorageAdapter', () => {
  beforeEach(localStorage.clear)
  test('Should call localStorage with correct values', () => {
    const sut = makeSut()
    const key = faker.database.column()
    const value = faker.random.words()
    sut.set(key, value)
    expect(localStorage.setItem).toHaveBeenCalledWith(key, value)
  })
})

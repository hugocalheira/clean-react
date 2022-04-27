import { LocalStorageAdapter } from './local-storage-adapter'
import faker from '@faker-js/faker'
import 'jest-localstorage-mock'

const makeSut = (): LocalStorageAdapter => new LocalStorageAdapter()

describe('LocalStorageAdapter', () => {
  beforeEach(localStorage.clear)
  test('Should localStorage.setItem with correct values', () => {
    const sut = makeSut()
    const key = faker.database.column()
    const value = {
      accessToken: faker.datatype.uuid(),
      name: faker.name.findName()
    }
    sut.set(key, value)
    expect(localStorage.setItem).toHaveBeenCalledWith(key, JSON.stringify(value))
  })

  test('Should localStorage.removeItem if value is null', () => {
    const sut = makeSut()
    const key = faker.database.column()
    sut.set(key, null)
    expect(localStorage.removeItem).toHaveBeenCalledWith(key)
  })

  test('Should localStorage.getItem with correct value', () => {
    const sut = makeSut()
    const key = faker.database.column()
    const value = {
      accessToken: faker.datatype.uuid(),
      name: faker.name.findName()
    }
    jest.spyOn(localStorage, 'getItem').mockReturnValueOnce(JSON.stringify(value))
    const result = sut.get(key)
    expect(localStorage.getItem).toHaveBeenCalledWith(key)
    expect(result).toEqual(value)
  })
})

import { LocalSaveAccessToken } from './local-save-access-token'
import faker from '@faker-js/faker'
import { SetStorageSpy } from '@/data/test'

type sutType = {
  sut: LocalSaveAccessToken
  setStorageSpy: SetStorageSpy
}

const makeSut = (): sutType => {
  const setStorageSpy = new SetStorageSpy()
  const sut = new LocalSaveAccessToken(setStorageSpy)
  return { sut, setStorageSpy }
}

describe('LocalSaveAccessToken', () => {
  test('Should call setStorage with correct value', async () => {
    const { sut, setStorageSpy } = makeSut()
    const accessToken = faker.datatype.uuid()
    await sut.save(accessToken)
    expect(setStorageSpy.key).toBe('accessToken')
    expect(setStorageSpy.value).toBe(accessToken)
  })
})

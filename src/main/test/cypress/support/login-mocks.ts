import * as Helper from '../support/http-mocks'
import faker from '@faker-js/faker'

export const mockInvalidCredentialsError = (): void => Helper.mockInvalidCredentialsError(/login/)

export const mockUnexpectedError = (): void => Helper.mockUnexpectedError(/login/, 'POST')

export const mockOk = (response: any = { accessToken: faker.datatype.uuid(), name: faker.name.findName() }): void => Helper.mockOk(/login/, 'POST', response)

export const mockInvalidData = (response: any = { accessToken: undefined }): void => Helper.mockOk(/login/, 'POST', response)

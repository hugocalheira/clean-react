import * as Http from '../support/http-mocks'
import faker from '@faker-js/faker'

export const mockInvalidCredentialsError = (): void => Http.mockUnauthorizedError(/login/)

export const mockUnexpectedError = (): void => Http.mockServerError(/login/, 'POST')

export const mockOk = (response: any = { accessToken: faker.datatype.uuid(), name: faker.name.findName() }): void => Http.mockOk(/login/, 'POST', response)

export const mockInvalidData = (response: any = { accessToken: undefined }): void => Http.mockOk(/login/, 'POST', response)

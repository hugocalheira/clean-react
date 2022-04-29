import * as Http from '../support/http-mocks'
import faker from '@faker-js/faker'

export const mockEmailInUseError = (): void => Http.mockForbiddenError(/signup/, 'POST')

export const mockUnexpectedError = (): void => Http.mockServerError(/signup/, 'POST')

export const mockInvalidData = (response: any = { accessToken: undefined }): void => Http.mockOk(/signup/, 'POST', response)

export const mockOk = (response: any = { accessToken: faker.datatype.uuid(), name: faker.name.findName() }): void => Http.mockOk(/signup/, 'POST', response)

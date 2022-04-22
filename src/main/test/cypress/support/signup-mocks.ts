import * as Helper from '../support/http-mocks'
import faker from '@faker-js/faker'

export const mockEmailInUseError = (): void => Helper.mockEmailInUseError(/signup/)

export const mockUnexpectedError = (): void => Helper.mockUnexpectedError(/signup/, 'POST')

export const mockInvalidData = (response: any = { accessToken: undefined }): void => Helper.mockOk(/signup/, 'POST', response)

export const mockOk = (response: any = { accessToken: faker.datatype.uuid() }): void => Helper.mockOk(/signup/, 'POST', response)

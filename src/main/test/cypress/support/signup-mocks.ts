import * as Helper from '../support/http-mocks'

export const mockEmailInUseError = (): void => Helper.mockEmailInUseError(/signup/)

export const mockUnexpectedError = (): void => Helper.mockUnexpectedError(/signup/, 'POST')

export const mockInvalidData = (response: any = { accessToken: undefined }): void => Helper.mockOk(/signup/, 'POST', response)

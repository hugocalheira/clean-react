import * as FormHelper from '../utils/form-helpers'
import * as Helper from '../utils/helpers'
// import * as Http from '../utils/login-mocks'
import * as Http from '../utils/http-mocks'
import faker from '@faker-js/faker'

const VALID_PASSWORD_LENGTH = 5
const INVALID_PASSWORD_LENGTH = VALID_PASSWORD_LENGTH - 1
const UNEXPECTED_ERROR_MESSAGE = 'Algo de errado aconteceu. Tente novamente em breve.'
const INVALID_CREDENTIALS_ERROR_MESSAGE = 'Credenciais inválidas'

const path = /login/
const mockInvalidCredentialsError = (): void => Http.mockUnauthorizedError(path)
const mockUnexpectedError = (): void => Http.mockServerError(path, 'POST')
const mockSuccess = (response: any = 'fx:account'): void => Http.mockOk(path, 'POST', response)
const mockInvalidData = (response: any = { accessToken: undefined }): void => Http.mockOk(path, 'POST', response)

const populateFields = (): Cypress.Chainable<Element> => {
  FormHelper.populateField('email', faker.internet.email())
  const fieldToChain = FormHelper.populateField('password', faker.random.alphaNumeric(VALID_PASSWORD_LENGTH))
  return fieldToChain
}

const simulateValidSubmit = (): void => {
  populateFields()
  cy.getByTestId('submit').click()
}

describe('Login', () => {
  beforeEach(() => {
    cy.visit('login')
  })

  it('Should load with correct initial state', () => {
    FormHelper.testFieldsHaveAttr(['email', 'password'], 'readOnly')
    FormHelper.testInputStatus('email', 'Campo obrigatório')
    FormHelper.testInputStatus('password', 'Campo obrigatório')
    FormHelper.testFormValidity(false)
  })

  it('Should present error state if form is invalid', () => {
    FormHelper.populateField('email', faker.random.word())
    FormHelper.populateField('password', faker.random.alphaNumeric(INVALID_PASSWORD_LENGTH))
    FormHelper.testInputStatus('email', 'Valor inválido')
    FormHelper.testInputStatus('password', 'Valor inválido')
    FormHelper.testFormValidity(false)
  })

  it('Should present valid state if form is valid', () => {
    populateFields()
    FormHelper.testInputStatus('email')
    FormHelper.testInputStatus('password')
    FormHelper.testFormValidity()
  })

  it('Should present InvalidCredentialsError on 401', () => {
    mockInvalidCredentialsError()
    simulateValidSubmit()
    FormHelper.testMainError(INVALID_CREDENTIALS_ERROR_MESSAGE)
    Helper.testUrl('/login')
  })

  it('Should present UnexpectedError on default error cases', () => {
    mockUnexpectedError()
    simulateValidSubmit()
    FormHelper.testMainError(UNEXPECTED_ERROR_MESSAGE)
    Helper.testUrl('/login')
  })

  it('Should present UnexpectedError if invalid data is returned', () => {
    mockInvalidData()
    simulateValidSubmit()
    Helper.testUrl('/login?error=invalidAccessToken')
    FormHelper.testMainError(UNEXPECTED_ERROR_MESSAGE)
    Helper.testLocalStorageItem('accessToken')
  })

  it('Should save account if valid credentials are provided', () => {
    const account = {
      accessToken: faker.datatype.uuid(),
      name: faker.name.findName()
    }
    mockSuccess(account)
    simulateValidSubmit()
    FormHelper.testMainError()
    Helper.testUrl('/')
    Helper.testLocalStorageItem('account', account)
  })

  it('Should prevent multiples submits', () => {
    mockSuccess()
    populateFields()
    cy.getByTestId('submit').dblclick()
    Helper.testHttpCallsCount(1)
  })

  it('Should submit using [Enter] key', () => {
    mockSuccess()
    populateFields().type('{enter}')
    Helper.testHttpCallsCount(1)
  })

  it('Should not call submit if form is invalid', () => {
    mockSuccess()
    FormHelper.populateField('email', faker.random.word())
    FormHelper.populateField('password', faker.random.alphaNumeric(VALID_PASSWORD_LENGTH)).type('{enter}')
    Helper.testHttpCallsCount(0)
  })
})

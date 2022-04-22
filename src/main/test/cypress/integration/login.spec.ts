import faker from '@faker-js/faker'
import * as FormHelper from '../support/form-helper'
import * as Http from '../support/login-mocks'

const VALID_PASSWORD_LENGTH = 5
const INVALID_PASSWORD_LENGTH = VALID_PASSWORD_LENGTH - 1
const UNEXPECTED_ERROR_MESSAGE = 'Algo de errado aconteceu. Tente novamente em breve.'
const INVALID_CREDENTIALS_ERROR_MESSAGE = 'Credenciais inválidas'

const populateFormValid = (): void => {
  FormHelper.populateField('email', faker.internet.email())
  FormHelper.populateField('password', faker.random.alphaNumeric(VALID_PASSWORD_LENGTH))
}

const simulateValidSubmit = (): void => {
  populateFormValid()
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
    populateFormValid()
    FormHelper.testInputStatus('email')
    FormHelper.testInputStatus('password')
    FormHelper.testFormValidity()
  })

  it('Should present InvalidCredentialsError on 401', () => {
    Http.mockInvalidCredentialsError()
    simulateValidSubmit()
    FormHelper.testMainError(INVALID_CREDENTIALS_ERROR_MESSAGE)
    FormHelper.testUrl('/login')
  })

  it('Should present UnexpectedError on default error cases', () => {
    Http.mockUnexpectedError()
    simulateValidSubmit()
    FormHelper.testMainError(UNEXPECTED_ERROR_MESSAGE)
    FormHelper.testUrl('/login')
  })

  it('Should save accessToken if valid credentials are provided', () => {
    const accessToken = faker.datatype.uuid()
    Http.mockOk({ accessToken })
    simulateValidSubmit()
    FormHelper.testMainError()
    FormHelper.testUrl('/')
    FormHelper.testLocalStorageItem('accessToken', accessToken)
  })

  it('Should present UnexpectedError if invalid data is returned', () => {
    Http.mockInvalidData()
    simulateValidSubmit()
    FormHelper.testMainError(UNEXPECTED_ERROR_MESSAGE)
    FormHelper.testUrl('/login')
    FormHelper.testLocalStorageItem('accessToken')
  })

  it('Should prevent multiples submits', () => {
    Http.mockOk()
    populateFormValid()
    cy.getByTestId('submit').dblclick()
    FormHelper.testHttpCallsCount(1)
  })

  it('Should submit using [Enter] key', () => {
    Http.mockOk()
    populateFormValid()
    cy.getByTestId('password').type('{enter}')
    FormHelper.testHttpCallsCount(1)
  })

  it('Should not call submit if form is invalid', () => {
    Http.mockOk()
    FormHelper.populateField('email', faker.random.word())
    FormHelper.populateField('password', faker.random.alphaNumeric(VALID_PASSWORD_LENGTH))
    cy.getByTestId('password').type('{enter}')
    FormHelper.testHttpCallsCount(0)
  })
})

import * as FormHelper from '../support/form-helper'
import * as Http from '../support/login-mocks'
import faker from '@faker-js/faker'

const VALID_PASSWORD_LENGTH = 5
const INVALID_PASSWORD_LENGTH = VALID_PASSWORD_LENGTH - 1
const UNEXPECTED_ERROR_MESSAGE = 'Algo de errado aconteceu. Tente novamente em breve.'
const INVALID_CREDENTIALS_ERROR_MESSAGE = 'Credenciais inválidas'

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

  it('Should present UnexpectedError if invalid data is returned', () => {
    Http.mockInvalidData()
    simulateValidSubmit()
    FormHelper.testUrl('/login?error=invalidAccessToken')
    FormHelper.testMainError(UNEXPECTED_ERROR_MESSAGE)
    FormHelper.testLocalStorageItem('accessToken')
  })

  it('Should save account if valid credentials are provided', () => {
    const account = {
      accessToken: faker.datatype.uuid(),
      name: faker.name.findName()
    }
    Http.mockOk(account)
    simulateValidSubmit()
    FormHelper.testMainError()
    FormHelper.testUrl('/')
    FormHelper.testLocalStorageItem('account', account)
  })

  it('Should prevent multiples submits', () => {
    Http.mockOk()
    populateFields()
    cy.getByTestId('submit').dblclick()
    FormHelper.testHttpCallsCount(1)
  })

  it('Should submit using [Enter] key', () => {
    Http.mockOk()
    populateFields().type('{enter}')
    FormHelper.testHttpCallsCount(1)
  })

  it('Should not call submit if form is invalid', () => {
    Http.mockOk()
    FormHelper.populateField('email', faker.random.word())
    FormHelper.populateField('password', faker.random.alphaNumeric(VALID_PASSWORD_LENGTH)).type('{enter}')
    FormHelper.testHttpCallsCount(0)
  })
})

import * as FormHelper from '../support/form-helper'
import * as Http from '../support/signup-mocks'
import faker from '@faker-js/faker'

const VALID_PASSWORD_LENGTH = 5
const INVALID_PASSWORD_LENGTH = VALID_PASSWORD_LENGTH - 1
const INVALID_EMAIL_IN_USE_ERROR_MESSAGE = 'E-mail já existe'
const UNEXPECTED_ERROR_MESSAGE = 'Algo de errado aconteceu. Tente novamente em breve.'

const populateFields = (): void => {
  const password = faker.random.alphaNumeric(VALID_PASSWORD_LENGTH)
  FormHelper.populateField('name', faker.name.findName())
  FormHelper.populateField('email', faker.internet.email())
  FormHelper.populateField('password', password)
  FormHelper.populateField('passwordConfirmation', password)
}

const simulateValidSubmit = (): void => {
  populateFields()
  cy.getByTestId('submit').click()
}

describe('SignUp', () => {
  beforeEach(() => {
    cy.visit('signup')
  })

  it('Should load with correct initial state', () => {
    FormHelper.testFieldsHaveAttr(['name', 'email', 'password', 'passwordConfirmation'], 'readOnly')
    FormHelper.testInputStatus('name', 'Campo obrigatório')
    FormHelper.testInputStatus('email', 'Campo obrigatório')
    FormHelper.testInputStatus('password', 'Campo obrigatório')
    FormHelper.testInputStatus('passwordConfirmation', 'Campo obrigatório')
    FormHelper.testFormValidity(false)
  })

  it('Should present error state if form is invalid', () => {
    FormHelper.populateField('email', faker.random.word())
    FormHelper.populateField('password', faker.random.alphaNumeric(INVALID_PASSWORD_LENGTH))
    FormHelper.populateField('passwordConfirmation', faker.random.alphaNumeric(VALID_PASSWORD_LENGTH))
    FormHelper.testInputStatus('email', 'Valor inválido')
    FormHelper.testInputStatus('password', 'Valor inválido')
    FormHelper.testInputStatus('passwordConfirmation', 'Valor inválido')
    FormHelper.testFormValidity(false)
  })

  it('Should present valid state if form is valid', () => {
    populateFields()
    FormHelper.testInputStatus('name')
    FormHelper.testInputStatus('email')
    FormHelper.testInputStatus('password')
    FormHelper.testInputStatus('passwordConfirmation')
    FormHelper.testFormValidity()
  })

  it('Should present EmailInUseError on 403', () => {
    Http.mockEmailInUseError()
    simulateValidSubmit()
    FormHelper.testMainError(INVALID_EMAIL_IN_USE_ERROR_MESSAGE)
    FormHelper.testUrl('/signup')
  })

  it('Should present UnexpectedError on default error cases', () => {
    Http.mockUnexpectedError()
    simulateValidSubmit()
    FormHelper.testMainError(UNEXPECTED_ERROR_MESSAGE)
    FormHelper.testUrl('/signup')
  })

  it('Should present UnexpectedError if invalid data is returned', () => {
    Http.mockInvalidData()
    simulateValidSubmit()
    FormHelper.testMainError(UNEXPECTED_ERROR_MESSAGE)
    FormHelper.testUrl('/signup')
    FormHelper.testLocalStorageItem('accessToken')
  })

  it('Should save accessToken in localStorage on success', () => {
    const accessToken = faker.datatype.uuid()
    Http.mockOk({ accessToken })
    simulateValidSubmit()
    FormHelper.testMainError()
    FormHelper.testUrl('/')
    FormHelper.testLocalStorageItem('accessToken', accessToken)
  })

  it('Should prevent multiples submits', () => {
    Http.mockOk()
    populateFields()
    cy.getByTestId('submit').dblclick()
    FormHelper.testHttpCallsCount(1)
  })

  it('Should submit using [Enter] key', () => {
    Http.mockOk()
    populateFields()
    cy.getByTestId('passwordConfirmation').type('{enter}')
    FormHelper.testHttpCallsCount(1)
  })

  it('Should not call submit if form is invalid', () => {
    Http.mockOk()
    populateFields()
    FormHelper.populateField('passwordConfirmation', faker.random.alphaNumeric(VALID_PASSWORD_LENGTH))
    cy.getByTestId('passwordConfirmation').type('{enter}')
    FormHelper.testHttpCallsCount(0)
    FormHelper.testUrl('/signup')
  })
})

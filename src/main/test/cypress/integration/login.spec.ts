import faker from '@faker-js/faker'
import * as FormHelper from '../support/form-helper'
import * as Http from './login-mocks'

const VALID_PASSWORD_LENGTH = 5
const INVALID_PASSWORD_LENGTH = VALID_PASSWORD_LENGTH - 1

const testFormValidity = (isValid = false): void => {
  cy.getByTestId('submit').should(isValid ? 'not.have.attr' : 'have.attr', 'disabled')
  cy.getByTestId('errorWrap').should('not.have.descendants')
}

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
    cy.getByTestId('email').should('have.attr', 'readOnly')
    cy.getByTestId('password').should('have.attr', 'readOnly')
    FormHelper.testInputStatus('email', 'Campo obrigatório')
    FormHelper.testInputStatus('password', 'Campo obrigatório')
    testFormValidity()
  })

  it('Should present error state if form is invalid', () => {
    FormHelper.populateField('email', faker.random.word())
    FormHelper.populateField('password', faker.random.alphaNumeric(INVALID_PASSWORD_LENGTH))
    FormHelper.testInputStatus('email', 'Valor inválido')
    FormHelper.testInputStatus('password', 'Valor inválido')
    testFormValidity()
  })

  it('Should present valid state if form is valid', () => {
    populateFormValid()
    FormHelper.testInputStatus('email')
    FormHelper.testInputStatus('password')
    testFormValidity(true)
  })

  it('Should present InvalidCredentialsError on 401', () => {
    Http.mockInvalidCredentialsError()
    simulateValidSubmit()
    FormHelper.testMainError('Credenciais inválidas')
    FormHelper.testUrl('/login')
  })

  it('Should present UnexpectedError on default error cases', () => {
    Http.mockUnexpectedError()
    simulateValidSubmit()
    FormHelper.testMainError('Algo de errado aconteceu. Tente novamente em breve.')
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
    FormHelper.testMainError('Algo de errado aconteceu. Tente novamente em breve.')
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

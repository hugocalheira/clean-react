import * as FormHelper from '../support/form-helper'
import faker from '@faker-js/faker'

const VALID_PASSWORD_LENGTH = 5
const INVALID_PASSWORD_LENGTH = VALID_PASSWORD_LENGTH - 1

const populateFormValid = (): void => {
  const password = faker.random.alphaNumeric(VALID_PASSWORD_LENGTH)
  FormHelper.populateField('name', faker.name.findName())
  FormHelper.populateField('email', faker.internet.email())
  FormHelper.populateField('password', password)
  FormHelper.populateField('passwordConfirmation', password)
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
    FormHelper.populateField('passwordConfirmation', faker.random.alphaNumeric(INVALID_PASSWORD_LENGTH))
    FormHelper.testInputStatus('email', 'Valor inválido')
    FormHelper.testInputStatus('password', 'Valor inválido')
    FormHelper.testInputStatus('passwordConfirmation', 'Valor inválido')
    FormHelper.testFormValidity(false)
  })

  it('Should present valid state if form is valid', () => {
    populateFormValid()
    FormHelper.testInputStatus('name')
    FormHelper.testInputStatus('email')
    FormHelper.testInputStatus('password')
    FormHelper.testInputStatus('passwordConfirmation')
    FormHelper.testFormValidity()
  })
})

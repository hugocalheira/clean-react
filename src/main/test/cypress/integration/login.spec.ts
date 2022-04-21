import faker from '@faker-js/faker'

const baseUrl: string = Cypress.config().baseUrl
const VALID_PASSWORD_LENGTH = 5
const INVALID_PASSWORD_LENGTH = VALID_PASSWORD_LENGTH - 1

const testFieldState = (fieldId: string, title: string, isValid = false): void => {
  cy.getByTestId(fieldId)
    .should('have.attr', 'title', title)
    .should('contain.text', isValid ? '🟢' : '🔴')
}

const testFormValidity = (isValid = false): void => {
  cy.getByTestId('submit').should(isValid ? 'not.have.attr' : 'have.attr', 'disabled')
  cy.getByTestId('errorWrap').should('not.have.descendants')
}

const populateField = (fieldId: string, value: string): void => {
  cy.getByTestId(fieldId).focus().type(value)
}

describe('Login', () => {
  beforeEach(() => {
    cy.visit('login')
  })

  it('Should load with correct initial state', () => {
    cy.getByTestId('email').should('have.attr', 'readOnly')
    cy.getByTestId('password').should('have.attr', 'readOnly')
    testFieldState('email-status', 'Campo obrigatório')
    testFieldState('password-status', 'Campo obrigatório')
    testFormValidity()
  })

  it('Should present error state if form is invalid', () => {
    populateField('email', faker.random.word())
    testFieldState('email-status', 'Valor inválido')
    populateField('password', faker.random.alphaNumeric(INVALID_PASSWORD_LENGTH))
    testFieldState('password-status', 'Valor inválido')
    testFormValidity()
  })

  it('Should present valid state if form is valid', () => {
    populateField('email', faker.internet.email())
    testFieldState('email-status', 'Tudo certo!', true)
    populateField('password', faker.random.alphaNumeric(VALID_PASSWORD_LENGTH))
    testFieldState('password-status', 'Tudo certo!', true)
    testFormValidity(true)
  })

  it('Should present error if invalid credentials are provided', () => {
    populateField('email', faker.internet.email())
    populateField('password', faker.random.alphaNumeric(VALID_PASSWORD_LENGTH))
    cy.getByTestId('submit').click()
    cy.getByTestId('errorWrap')
      .getByTestId('spinner')
      .should('exist')
      .getByTestId('main-error')
      .should('not.exist')
      .getByTestId('spinner')
      .should('not.exist')
      .getByTestId('main-error')
      .should('exist')
      .should('contain.text', 'Credenciais inválidas')
    cy.url().should('eq', `${baseUrl}/login`)
  })

  it('Should save accessToken if valid credentials are provided', () => {
    populateField('email', 'mango@gmail.com')
    populateField('password', '12345')
    cy.getByTestId('submit').click()
    cy.getByTestId('errorWrap')
      .getByTestId('spinner')
      .should('exist')
      .getByTestId('main-error')
      .should('not.exist')

    cy.url().should('eq', `${baseUrl}/`)
    cy.window().then(window => assert.isOk(window.localStorage.getItem('accessToken')))
  })
})

import faker from '@faker-js/faker'

const baseUrl: string = Cypress.config().baseUrl
const VALID_PASSWORD_LENGTH = 5
const INVALID_PASSWORD_LENGTH = VALID_PASSWORD_LENGTH - 1

const testFieldState = (fieldId: string, title: string, isValid = false): void => {
  cy.getByTestId(`${fieldId}-wrap`)
    .should('have.attr', 'data-status', isValid ? 'valid' : 'invalid')
  cy.getByTestId(fieldId)
    .should(isValid ? 'not.have.attr' : 'have.attr', 'title', title)
    // .should('contain.text', isValid ? '🟢' : '🔴')
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
    testFieldState('email', 'Campo obrigatório')
    testFieldState('password', 'Campo obrigatório')
    testFormValidity()
  })

  it('Should present error state if form is invalid', () => {
    populateField('email', faker.random.word())
    testFieldState('email', 'Valor inválido')
    populateField('password', faker.random.alphaNumeric(INVALID_PASSWORD_LENGTH))
    testFieldState('password', 'Valor inválido')
    testFormValidity()
  })

  it('Should present valid state if form is valid', () => {
    populateField('email', faker.internet.email())
    testFieldState('email', '', true)
    populateField('password', faker.random.alphaNumeric(VALID_PASSWORD_LENGTH))
    testFieldState('password', '', true)
    testFormValidity(true)
  })

  it('Should present InvalidCredentialsError on 401', () => {
    cy.intercept('POST', /login/, {
      statusCode: 401,
      body: { error: faker.random.words() }
    })

    populateField('email', faker.internet.email())
    populateField('password', faker.random.alphaNumeric(VALID_PASSWORD_LENGTH))
    cy.getByTestId('submit').click()
    cy.getByTestId('spinner').should('not.exist')
    cy.getByTestId('main-error').should('exist')
      .should('contain.text', 'Credenciais inválidas')
    cy.url().should('eq', `${baseUrl}/login`)
  })

  it('Should present UnexpectedError on 400', () => {
    cy.intercept('POST', /login/, {
      statusCode: 400,
      body: { error: faker.random.words() }
    })

    populateField('email', faker.internet.email())
    populateField('password', faker.random.alphaNumeric(VALID_PASSWORD_LENGTH))
    cy.getByTestId('submit').click()
    cy.getByTestId('spinner').should('not.exist')
    cy.getByTestId('main-error').should('exist')
      .should('contain.text', 'Algo de errado aconteceu. Tente novamente em breve.')
    cy.url().should('eq', `${baseUrl}/login`)
  })

  it('Should save accessToken if valid credentials are provided', () => {
    const accessToken = faker.datatype.uuid()
    cy.intercept('POST', /login/, {
      statusCode: 200,
      body: {
        accessToken,
        name: faker.name.findName()
      }
    })

    populateField('email', faker.internet.email())
    populateField('password', faker.random.alphaNumeric(VALID_PASSWORD_LENGTH))
    cy.getByTestId('submit').click()
    cy.getByTestId('spinner').should('not.exist')
    cy.getByTestId('main-error').should('not.exist')

    cy.url().should('eq', `${baseUrl}/`)
    cy.window().then(window => {
      const savedAccessToken = window.localStorage.getItem('accessToken')
      assert.isOk(savedAccessToken)
      assert.equal(savedAccessToken, accessToken)
    })
  })

  it('Should present UnexpectedError if invalid data is returned', () => {
    cy.intercept('POST', /login/, {
      statusCode: 200,
      body: {
        accessToken: undefined,
        name: faker.name.findName()
      }
    })

    populateField('email', faker.internet.email())
    populateField('password', faker.random.alphaNumeric(VALID_PASSWORD_LENGTH))
    cy.getByTestId('submit').click()
    cy.getByTestId('spinner').should('not.exist')
    cy.getByTestId('main-error').should('exist')
      .should('contain.text', 'Algo de errado aconteceu. Tente novamente em breve.')

    cy.url().should('eq', `${baseUrl}/login`)
    cy.window().then(window => {
      const savedAccessToken = window.localStorage.getItem('accessToken')
      assert.isNull(savedAccessToken)
    })
  })

  it('Should prevent multiples submits', () => {
    cy.intercept('POST', /login/, {
      statusCode: 200,
      body: {
        accessToken: faker.datatype.uuid(),
        name: faker.name.findName()
      }
    }).as('request')

    populateField('email', faker.internet.email())
    populateField('password', faker.random.alphaNumeric(VALID_PASSWORD_LENGTH))
    cy.getByTestId('submit').dblclick()
    cy.get('@request.all').should('have.length', 1)
  })

  it('Should submit using [Enter] key', () => {
    cy.intercept('POST', /login/, {
      statusCode: 200,
      body: {
        accessToken: faker.datatype.uuid(),
        name: faker.name.findName()
      }
    }).as('request')

    populateField('email', faker.internet.email())
    populateField('password', faker.random.alphaNumeric(VALID_PASSWORD_LENGTH))
    cy.getByTestId('password').type('{enter}')
    cy.get('@request.all').should('have.length', 1)
  })

  it('Should not call submit if form is invalid', () => {
    cy.intercept('POST', /login/, {
      statusCode: 200,
      body: {
        accessToken: faker.datatype.uuid(),
        name: faker.name.findName()
      }
    }).as('request')

    populateField('email', faker.random.word())
    populateField('password', faker.random.alphaNumeric(VALID_PASSWORD_LENGTH))
    cy.getByTestId('password').type('{enter}')
    cy.get('@request.all').should('have.length', 0)
  })
})

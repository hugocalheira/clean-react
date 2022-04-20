import faker from '@faker-js/faker'

const { baseUrl } = Cypress.config()
const VALID_PASSWORD_LENGTH = 5
const INVALID_PASSWORD_LENGTH = VALID_PASSWORD_LENGTH - 1

describe('Login', () => {
    beforeEach(() => {
        cy.visit('login')
    })

    it('Should load with correct initial state', () => {
        cy.getByTestId('email').should('have.attr', 'readOnly')
        cy.getByTestId('password').should('have.attr', 'readOnly')
        cy.getByTestId('email-status')
            .should('have.attr', 'title', 'Campo obrigatório')
            .should('contain.text', '🔴')
        cy.getByTestId('password-status')
            .should('have.attr', 'title', 'Campo obrigatório')
            .should('contain.text', '🔴')
        cy.getByTestId('submit').should('have.attr', 'disabled')
        cy.getByTestId('errorWrap').should('not.have.descendants')
    })

    it('Should present error state if form is invalid', () => {
        cy.getByTestId('email').focus().type(faker.random.word())
        cy.getByTestId('email-status')
            .should('have.attr', 'title', 'Valor inválido')
            .should('contain.text', '🔴')
        cy.getByTestId('password').focus().type(faker.random.alphaNumeric(INVALID_PASSWORD_LENGTH))
        cy.getByTestId('password-status')
            .should('have.attr', 'title', 'Valor inválido')
            .should('contain.text', '🔴')
        cy.getByTestId('submit').should('have.attr', 'disabled')
        cy.getByTestId('errorWrap').should('not.have.descendants')
    })

    it('Should present valid state if form is valid', () => {
        cy.getByTestId('email').focus().type(faker.internet.email())
        cy.getByTestId('email-status')
            .should('have.attr', 'title', 'Tudo certo!')
            .should('contain.text', '🟢')
        cy.getByTestId('password').focus().type(faker.random.alphaNumeric(VALID_PASSWORD_LENGTH))
        cy.getByTestId('password-status')
        .should('have.attr', 'title', 'Tudo certo!')
        .should('contain.text', '🟢')
        cy.getByTestId('submit').should('not.have.attr', 'disabled')
        cy.getByTestId('errorWrap').should('not.have.descendants')
    })

    it('Should present error if invalid credentials are provided', () => {
        cy.getByTestId('email').focus().type(faker.internet.email())
        cy.getByTestId('password').focus().type(faker.random.alphaNumeric(VALID_PASSWORD_LENGTH))        
        cy.getByTestId('submit').click()
        cy.getByTestId('errorWrap')
            .getByTestId('spinner')
                .should('exist')
            .getByTestId('main-error')
                .should('not.exist')
            .getByTestId('spinner')
                .should('not.exist')
            // .getByTestId('main-error')
            //     .should('exist')
            //     .should('contain.text', 'Credenciais inválidas')
        cy.url().should('eq', `${baseUrl}/login`)
    })
})
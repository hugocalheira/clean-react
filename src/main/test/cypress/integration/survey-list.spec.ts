import * as Helper from '../utils/helpers'
import * as Http from '../utils/http-mocks'

const UNEXPECTED_ERROR_MESSAGE = 'Algo de errado aconteceu. Tente novamente em breve.'

const path = /surveys/
const mockUnexpectedError = (): void => Http.mockServerError(path, 'GET')
const mockAccessDeniedError = (): void => Http.mockForbiddenError(path, 'GET')
const mockSuccess = (): void => {
  cy.fixture('survey-list').then(surveyList => {
    Http.mockOk(path, 'GET', surveyList)
  })
}

describe('SurveyList', () => {
  beforeEach(() => {
    cy.fixture('account').then(account =>
      Helper.setLocalStorageItem('account', account)
    )
  })

  it('Should present error on UnexpectedError', () => {
    mockUnexpectedError()
    cy.visit('')
    cy.getByTestId('error').should('contain.text', UNEXPECTED_ERROR_MESSAGE)
  })

  it('Should logout on AccessDeniedError', () => {
    mockAccessDeniedError()
    cy.visit('')
    Helper.testUrl('/login')
    Helper.testLocalStorageItem('account')
  })

  it('Should present correct username', () => {
    mockUnexpectedError()
    cy.visit('')
    const account = Helper.getLocalStorageItem('account')
    cy.getByTestId('username').should('contain.text', account.name)
  })

  it('Should logout when click to logout', () => {
    mockUnexpectedError()
    cy.visit('')
    cy.getByTestId('logout').click()
    Helper.testUrl('/login')
    Helper.testLocalStorageItem('account')
  })

  it('Should present survey items', () => {
    mockSuccess()
    cy.visit('')
    cy.get('li:empty').should('have.length', 4)
    cy.get('li:not(:empty)').should('have.length', 2)
    cy.get('li:nth-child(1)').then(li => {
      assert.equal(li.find('[data-testid="day"]').text(), '22')
      assert.equal(li.find('[data-testid="month"]').text(), 'jul')
      assert.equal(li.find('[data-testid="year"]').text(), '2020')
      assert.equal(li.find('[data-testid="question"]').text(), 'Qual é seu framework web favorito?')
      cy.fixture('icons').then(({ thumbUp }) => {
        assert.equal(li.find('[data-testid="icon"]').attr('src'), thumbUp)
      })
    })
    cy.get('li:nth-child(2)').then(li => {
      assert.equal(li.find('[data-testid="day"]').text(), '02')
      assert.equal(li.find('[data-testid="month"]').text(), 'ago')
      assert.equal(li.find('[data-testid="year"]').text(), '2020')
      assert.equal(li.find('[data-testid="question"]').text(), 'O que você usa para desenvolver aplicativos?')
      cy.fixture('icons').then(({ thumbDown }) => {
        assert.equal(li.find('[data-testid="icon"]').attr('src'), thumbDown)
      })
    })
  })
})

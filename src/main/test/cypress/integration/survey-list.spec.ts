import * as Helper from '../utils/helpers'
import * as Http from '../utils/http-mocks'
import faker from '@faker-js/faker'

const UNEXPECTED_ERROR_MESSAGE = 'Algo de errado aconteceu. Tente novamente em breve.'

const path = /surveys/
const mockUnexpectedError = (): void => Http.mockServerError(path, 'GET')
const mockAccessDeniedError = (): void => Http.mockForbiddenError(path, 'GET')

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
})

import * as Helper from '../support/helpers'
import * as Http from '../support/survey-list-mocks'
import faker from '@faker-js/faker'

const UNEXPECTED_ERROR_MESSAGE = 'Algo de errado aconteceu. Tente novamente em breve.'

describe('SurveyList', () => {
  beforeEach(() => {
    Helper.setLocalStorageItem('account', {
      name: faker.name.findName(),
      accessToken: faker.datatype.uuid()
    })
  })

  it('Should present error on UnexpectedError', () => {
    Http.mockUnexpectedError()
    cy.visit('')
    cy.getByTestId('error').should('contain.text', UNEXPECTED_ERROR_MESSAGE)
  })

  it('Should logout on AccessDeniedError', () => {
    Http.mockAccessDeniedError()
    cy.visit('')
    Helper.testUrl('/login')
    Helper.testLocalStorageItem('account')
  })

  it('Should present correct username', () => {
    Http.mockUnexpectedError()
    cy.visit('')
    const account = Helper.getLocalStorageItem('account')
    cy.getByTestId('username').should('contain.text', account.name)
  })
})

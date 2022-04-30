import * as Helper from '../support/helpers'

describe('PrivateRoutes', () => {
  it('Should logout if survey-list has no token', () => {
    cy.visit('/')
    Helper.testUrl('/login?error=invalidAccessToken')
  })
})
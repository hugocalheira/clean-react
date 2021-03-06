import faker from '@faker-js/faker'

export const mockUnauthorizedError = (url: RegExp): void => {
  cy.intercept('POST', url, {
    statusCode: 401,
    body: { error: faker.random.words() }
  }).as('request')
}

export const mockForbiddenError = (url: RegExp, method: any): void => {
  cy.intercept(method, url, {
    statusCode: 403,
    body: { error: faker.random.words() }
  }).as('request')
}

export const mockServerError = (url: RegExp, method: any): void => {
  cy.intercept(method, url, {
    statusCode: faker.random.arrayElement([400, 404, 500]),
    body: { error: faker.random.words() }
  }).as('request')
}

export const mockOk = (url: RegExp, method: any, response: any): void => {
  cy.intercept(method, url, {
    statusCode: 200,
    body: response
  }).as('request')
}

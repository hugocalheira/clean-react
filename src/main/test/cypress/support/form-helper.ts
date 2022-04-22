export const testInputStatus = (field: string, error = ''): void => {
  cy.getByTestId(`${field}-wrap`)
    .should('have.attr', 'data-status', !error ? 'valid' : 'invalid')
  cy.getByTestId(field)
    .should(!error ? 'not.have.attr' : 'have.attr', 'title', error)
}

export const testMainError = (error?: string): void => {
  cy.getByTestId('spinner').should('not.exist')
  cy.getByTestId('main-error').should(`${error ? '' : 'not.'}exist`)
  error && cy.getByTestId('main-error').should('contain.text', error)
}

export const testHttpCallsCount = (count: number): void => {
  cy.get('@request.all').should('have.length', count)
}

export const populateField = (fieldId: string, value: string): Cypress.Chainable<Element> => {
  cy.getByTestId(fieldId).focus().type(value)
  return cy.getByTestId(fieldId)
}

export const testUrl = (url: string): void => {
  const baseUrl: string = Cypress.config().baseUrl
  cy.url().should('eq', `${baseUrl}${url}`)
}

export const testLocalStorageItem = (key: string, value?: string): void => {
  cy.window().then(window => {
    const savedValue = window.localStorage.getItem(key)
    if (value) {
      assert.isOk(savedValue)
      assert.equal(savedValue, value)
    } else {
      assert.isNull(savedValue)
    }
  })
}

export const testFormValidity = (isValid = true): void => {
  cy.getByTestId('submit').should(isValid ? 'not.have.attr' : 'have.attr', 'disabled')
  cy.getByTestId('errorWrap').should('not.have.descendants')
}

export const testFieldsHaveAttr = (fields: string[], attr: string): void => {
  fields.forEach(field => cy.getByTestId(field).should('have.attr', attr))
}

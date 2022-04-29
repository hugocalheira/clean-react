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

export const populateField = (fieldId: string, value: string): Cypress.Chainable<Element> => {
  cy.getByTestId(fieldId).focus().type(value)
  return cy.getByTestId(fieldId)
}

export const testFormValidity = (isValid = true): void => {
  cy.getByTestId('submit').should(isValid ? 'not.have.attr' : 'have.attr', 'disabled')
  cy.getByTestId('errorWrap').should('not.have.descendants')
}

export const testFieldsHaveAttr = (fields: string[], attr: string): void => {
  fields.forEach(field => cy.getByTestId(field).should('have.attr', attr))
}

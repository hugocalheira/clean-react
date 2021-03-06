const baseUrl: string = Cypress.config().baseUrl

export const testHttpCallsCount = (count: number): void => {
  cy.get('@request.all').should('have.length', count)
}

export const testUrl = (url: string): void => {
  cy.url().should('eq', `${baseUrl}${url}`)
}

export const testLocalStorageItem = (key: string, value?: object): void => {
  cy.window().then(window => {
    const savedValue = window.localStorage.getItem(key)
    if (value) {
      assert.isOk(savedValue)
      assert.equal(savedValue, JSON.stringify(value))
    } else {
      assert.isNull(savedValue)
    }
  })
}

export const setLocalStorageItem = (key: string, value?: object): void => {
  localStorage.setItem(key, JSON.stringify(value))
}

export const getLocalStorageItem = (key: string): any => {
  return JSON.parse(localStorage.getItem(key))
}

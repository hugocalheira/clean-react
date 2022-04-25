import faker from '@faker-js/faker'
import { fireEvent, screen } from '@testing-library/react'

export const testStatusForField = (fieldName: string, validationError = ''): void => {
  expect(screen.getByTestId(`${fieldName}-wrap`))
    .toHaveAttribute('data-status', validationError ? 'invalid' : 'valid')
  expect(screen.getByTestId(fieldName))
    .toHaveProperty('title', validationError)
}

export const populateField = (fieldName: string, value = faker.random.word()): void => {
  const fieldInput = screen.getByTestId(fieldName)
  fireEvent.input(fieldInput, { target: { value } })
}

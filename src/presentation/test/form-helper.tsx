import faker from '@faker-js/faker'
import { fireEvent, screen } from '@testing-library/react'

export const testChildCount = (fieldName: string, count: number): void => {
  const element = screen.getByTestId(fieldName)
  expect(element.childElementCount).toBe(count)
}

export const testButtonIsDisabled = (buttonId: string, expected = true): void => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  const button = screen.getByTestId(buttonId) as HTMLButtonElement
  expect(button.disabled).toBe(expected)
}

export const testStatusForField = (fieldName: string, validationError?: string): void => {
  const fieldStatus = screen.getByTestId(`${fieldName}-status`)
  expect(fieldStatus.title).toBe(validationError || 'Tudo certo!')
  expect(fieldStatus.textContent).toBe(validationError ? '🔴' : '🟢')
}

export const populateField = (fieldName: string, value = faker.random.word()): void => {
  const fieldInput = screen.getByTestId(fieldName)
  fireEvent.input(fieldInput, { target: { value } })
}

export const testElementExist = (fieldname: string): void => {
  const element = screen.getByTestId(fieldname)
  expect(element).toBeTruthy()
}

export const testElementText = async (fieldname: string, text: string): Promise<void> => {
  const { textContent } = await screen.findByTestId(fieldname) // findByTestId is async
  expect(textContent).toBe(text)
}

import faker from '@faker-js/faker'
import { fireEvent, RenderResult } from '@testing-library/react'

export const testChildCount = (sut: RenderResult, fieldName: string, count: number): void => {
  const element = sut.getByTestId(fieldName)
  expect(element.childElementCount).toBe(count)
}

export const testButtonIsDisabled = (sut: RenderResult, text: RegExp, expected = true): void => {
  const button = sut.getByText(text).closest('button')
  expect(button.disabled).toBe(expected)
}

export const testStatusForField = (sut: RenderResult, fieldName: string, validationError?: string): void => {
  const fieldStatus = sut.getByTestId(`${fieldName}-status`)
  expect(fieldStatus.title).toBe(validationError || 'Tudo certo!')
  expect(fieldStatus.textContent).toBe(validationError ? '🔴' : '🟢')
}

export const populateField = (sut: RenderResult, fieldName: string, value = faker.random.word()): void => {
  const fieldInput = sut.getByTestId(fieldName)
  fireEvent.input(fieldInput, { target: { value } })
}

export const testElementExist = (sut: RenderResult, fieldname: string): void => {
  const element = sut.getByTestId(fieldname)
  expect(element).toBeTruthy()
}

export const testElementText = async (sut: RenderResult, fieldname: string, text: string): Promise<void> => {
  const { textContent } = await sut.findByTestId(fieldname) // findByTestId is async
  expect(textContent).toBe(text)
}

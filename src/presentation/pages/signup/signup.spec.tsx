import React from 'react'
import { render, RenderResult } from '@testing-library/react'
import SignUp from './signup'
import { BrowserRouter } from 'react-router-dom'

type SutTypes = {
  sut: RenderResult
}

const MakeSut = (): SutTypes => {
  const sut = render(
    <BrowserRouter>
        <SignUp />
    </BrowserRouter>
  )
  return { sut }
}

const testChildCount = (sut: RenderResult, fieldName: string, count: number): void => {
  const element = sut.getByTestId(fieldName)
  expect(element.childElementCount).toBe(count)
}

const testButtonIsDisabled = (sut: RenderResult, text: RegExp, expected = true): void => {
  const button = sut.getByText(text).closest('button')
  expect(button.disabled).toBe(expected)
}

const testStatusForField = (sut: RenderResult, fieldName: string, validationError?: string): void => {
  const fieldStatus = sut.getByTestId(`${fieldName}-status`)
  expect(fieldStatus.title).toBe(validationError || 'Tudo certo!')
  expect(fieldStatus.textContent).toBe(validationError ? '🔴' : '🟢')
}

describe('SignUp Component', () => {
  test('Should start with initial state', () => {
    const validationError = 'Campo obrigatório'
    const { sut } = MakeSut()
    testChildCount(sut, 'errorWrap', 0)
    testButtonIsDisabled(sut, /Entrar/i)
    testStatusForField(sut, 'name', validationError)
    testStatusForField(sut, 'email', validationError)
    testStatusForField(sut, 'password', validationError)
    testStatusForField(sut, 'passwordConfirmation', validationError)
  })
})

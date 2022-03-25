import React from 'react'
import { cleanup, fireEvent, render, RenderResult } from '@testing-library/react'
import { Login } from '@/presentation/pages'
import { ValidationStub } from '@/presentation/test'
import faker from '@faker-js/faker'

type SutTypes = {
  sut: RenderResult
  validationStub: ValidationStub
}

const MakeSut = (): SutTypes => {
  const validationStub = new ValidationStub()
  validationStub.errorMessage = faker.random.words(5)
  const sut = render(<Login validation={validationStub} />)
  return {
    sut,
    validationStub
  }
}

describe('Login Component', () => {
  afterEach(cleanup)
  test('Should start with initial state', () => {
    const { sut, validationStub } = MakeSut()
    const { getByTestId, getByText } = sut

    const errorWrap = getByTestId('errorWrap')
    expect(errorWrap.childElementCount).toBe(0)

    const submitButton = getByText(/Entrar/i).closest('button')
    expect(submitButton.disabled).toBe(true)

    const emailStatus = getByTestId('email-status')
    expect(emailStatus.title).toBe(validationStub.errorMessage)
    expect(emailStatus.textContent).toBe('🔴')

    const passwordStatus = getByTestId('password-status')
    expect(passwordStatus.title).toBe(validationStub.errorMessage)
    expect(passwordStatus.textContent).toBe('🔴')
  })

  // test('Should call Validation with correct email', async () => {
  //   const { sut, validationStub } = MakeSut()
  //   const emailInput = sut.getByPlaceholderText('Digite seu e-mail')
  //   const email = faker.internet.email()
  //   fireEvent.input(emailInput, { target: { value: email } })
  //   expect(validationStub.fieldName).toBe('email')
  //   expect(validationStub.fieldValue).toBe(email)
  // })

  // test('Should call Validation with correct password', () => {
  //   const { sut, validationStub } = MakeSut()
  //   const passwordInput = sut.getByPlaceholderText('Digite sua senha')
  //   const password = faker.internet.password()
  //   fireEvent.input(passwordInput, { target: { value: password } })
  //   expect(validationStub.fieldName).toBe('password')
  //   expect(validationStub.fieldValue).toBe(password)
  // })

  test('Should show email error if Validation fails', () => {
    const { sut, validationStub } = MakeSut()
    const emailInput = sut.getByPlaceholderText('Digite seu e-mail')

    fireEvent.input(emailInput, { target: { value: faker.internet.email() } })
    const emailStatus = sut.getByTestId('email-status')
    expect(emailStatus.title).toBe(validationStub.errorMessage)
    expect(emailStatus.textContent).toBe('🔴')
  })

  test('Should show password error if Validation fails', () => {
    const { sut, validationStub } = MakeSut()
    const passwordInput = sut.getByPlaceholderText('Digite sua senha')

    fireEvent.input(passwordInput, { target: { value: faker.internet.password() } })
    const passwordStatus = sut.getByTestId('password-status')
    expect(passwordStatus.title).toBe(validationStub.errorMessage)
    expect(passwordStatus.textContent).toBe('🔴')
  })
})

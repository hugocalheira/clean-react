import React from 'react'
import { cleanup, fireEvent, render, RenderResult } from '@testing-library/react'
import { Login } from '@/presentation/pages'
import { ValidationStub } from '@/presentation/test'
import faker from '@faker-js/faker'

type SutTypes = {
  sut: RenderResult
}

type SutParams = {
  validationError: string
}

const MakeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub()
  validationStub.errorMessage = params?.validationError
  const sut = render(<Login validation={validationStub} />)
  return { sut }
}

describe('Login Component', () => {
  afterEach(cleanup)
  test('Should start with initial state', () => {
    const validationError = faker.random.words()
    const { sut } = MakeSut({ validationError })

    const { getByTestId, getByText } = sut

    const errorWrap = getByTestId('errorWrap')
    expect(errorWrap.childElementCount).toBe(0)

    const submitButton = getByText(/Entrar/i).closest('button')
    expect(submitButton.disabled).toBe(true)

    const emailStatus = getByTestId('email-status')
    expect(emailStatus.title).toBe(validationError)
    expect(emailStatus.textContent).toBe('🔴')

    const passwordStatus = getByTestId('password-status')
    expect(passwordStatus.title).toBe(validationError)
    expect(passwordStatus.textContent).toBe('🔴')
  })

  test('Should show email error if Validation fails', () => {
    const validationError = faker.random.words()
    const { sut } = MakeSut({ validationError })

    const emailInput = sut.getByPlaceholderText('Digite seu e-mail')

    fireEvent.input(emailInput, { target: { value: faker.internet.email() } })
    const emailStatus = sut.getByTestId('email-status')
    expect(emailStatus.title).toBe(validationError)
    expect(emailStatus.textContent).toBe('🔴')
  })

  test('Should show password error if Validation fails', () => {
    const validationError = faker.random.words()
    const { sut } = MakeSut({ validationError })

    const passwordInput = sut.getByPlaceholderText('Digite sua senha')

    fireEvent.input(passwordInput, { target: { value: faker.internet.password() } })
    const passwordStatus = sut.getByTestId('password-status')
    expect(passwordStatus.title).toBe(validationError)
    expect(passwordStatus.textContent).toBe('🔴')
  })

  test('Should show valid status if email Validation succeeds', () => {
    const { sut } = MakeSut()

    const emailInput = sut.getByPlaceholderText('Digite seu e-mail')
    fireEvent.input(emailInput, { target: { value: faker.internet.email() } })
    const emailStatus = sut.getByTestId('email-status')
    expect(emailStatus.title).toBe('Tudo certo!')
    expect(emailStatus.textContent).toBe('🟢')
  })

  test('Should show valid status if password Validation succeeds', () => {
    const { sut } = MakeSut()

    const passwordInput = sut.getByPlaceholderText('Digite sua senha')
    fireEvent.input(passwordInput, { target: { value: faker.internet.password() } })
    const passwordStatus = sut.getByTestId('password-status')
    expect(passwordStatus.title).toBe('Tudo certo!')
    expect(passwordStatus.textContent).toBe('🟢')
  })

  test('Should enable submit button if form is valid', () => {
    const { sut } = MakeSut()

    const emailInput = sut.getByPlaceholderText('Digite seu e-mail')
    fireEvent.input(emailInput, { target: { value: faker.internet.email() } })

    const passwordInput = sut.getByPlaceholderText('Digite sua senha')
    fireEvent.input(passwordInput, { target: { value: faker.internet.password() } })

    const submitButton = sut.getByText(/Entrar/i).closest('button')
    expect(submitButton.disabled).toBe(false)
  })
})

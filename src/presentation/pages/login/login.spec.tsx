import React from 'react'
import { cleanup, fireEvent, render, RenderResult, waitFor } from '@testing-library/react'
import { Login } from '@/presentation/pages'
import { ValidationStub, AuthenticationSpy } from '@/presentation/test'
import faker from '@faker-js/faker'
import { InvalidCredentialsError } from '@/domain/errors'
import 'jest-localstorage-mock'

type SutTypes = {
  sut: RenderResult
  authenticationSpy: AuthenticationSpy
}

type SutParams = {
  validationError: string
}

const MakeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub()
  const authenticationSpy = new AuthenticationSpy()
  validationStub.errorMessage = params?.validationError
  const sut = render(<Login validation={validationStub} authentication={authenticationSpy} />)
  return { sut, authenticationSpy }
}

const simulateValidSubmit = (sut: RenderResult, email = faker.internet.email(), password = faker.internet.password()): void => {
  populateEmailField(sut, email)
  populatePasswordField(sut, password)
  const submitButton = sut.getByText(/Entrar/i).closest('button')
  fireEvent.click(submitButton)
}

const populateEmailField = (sut: RenderResult, email = faker.internet.email()): void => {
  const emailInput = sut.getByPlaceholderText('Digite seu e-mail')
  fireEvent.input(emailInput, { target: { value: email } })
}

const populatePasswordField = (sut: RenderResult, password = faker.internet.password()): void => {
  const passwordInput = sut.getByPlaceholderText('Digite sua senha')
  fireEvent.input(passwordInput, { target: { value: password } })
}

const simulateStatusForField = (sut: RenderResult, fieldName: string, validationError?: string): void => {
  const fieldStatus = sut.getByTestId(`${fieldName}-status`)
  expect(fieldStatus.title).toBe(validationError || 'Tudo certo!')
  expect(fieldStatus.textContent).toBe(validationError ? '🔴' : '🟢')
}

describe('Login Component', () => {
  afterEach(cleanup)
  beforeEach(localStorage.clear)
  test('Should start with initial state', () => {
    const validationError = faker.random.words()
    const { sut } = MakeSut({ validationError })

    const { getByTestId, getByText } = sut

    const errorWrap = getByTestId('errorWrap')
    expect(errorWrap.childElementCount).toBe(0)

    const submitButton = getByText(/Entrar/i).closest('button')
    expect(submitButton.disabled).toBe(true)

    simulateStatusForField(sut, 'email', validationError)
    simulateStatusForField(sut, 'password', validationError)
  })

  test('Should show email error if Validation fails', () => {
    const validationError = faker.random.words()
    const { sut } = MakeSut({ validationError })
    populateEmailField(sut)
    simulateStatusForField(sut, 'email', validationError)
  })

  test('Should show password error if Validation fails', () => {
    const validationError = faker.random.words()
    const { sut } = MakeSut({ validationError })
    populatePasswordField(sut)
    simulateStatusForField(sut, 'password', validationError)
  })

  test('Should show valid status if email Validation succeeds', () => {
    const { sut } = MakeSut()
    populateEmailField(sut)
    simulateStatusForField(sut, 'email')
  })

  test('Should show valid status if password Validation succeeds', () => {
    const { sut } = MakeSut()
    populatePasswordField(sut)
    simulateStatusForField(sut, 'password')
  })

  test('Should enable submit button if form is valid', () => {
    const { sut } = MakeSut()
    populateEmailField(sut)
    populatePasswordField(sut)
    const submitButton = sut.getByText(/Entrar/i).closest('button')
    expect(submitButton.disabled).toBe(false)
  })

  test('Should show spinner on submit', () => {
    const { sut } = MakeSut()
    simulateValidSubmit(sut)
    const spinner = sut.getByTestId('spinner')
    expect(spinner).toBeTruthy()
  })

  test('Should call Authentication with correct values', () => {
    const { sut, authenticationSpy } = MakeSut()
    const email = faker.internet.email()
    const password = faker.internet.password()
    simulateValidSubmit(sut, email, password)
    expect(authenticationSpy.params).toEqual({
      email,
      password
    })
  })

  test('Should call Authentication only once', () => {
    const { sut, authenticationSpy } = MakeSut()
    simulateValidSubmit(sut)
    simulateValidSubmit(sut)
    expect(authenticationSpy.callsCount).toBe(1)
  })

  test('Should not call Authentication if form is invalid', () => {
    const validationError = faker.random.words()
    const { sut, authenticationSpy } = MakeSut({ validationError })
    populateEmailField(sut)
    fireEvent.submit(sut.getByTestId('form'))
    expect(authenticationSpy.callsCount).toBe(0)
  })

  test('Should present error if Authentication fails', async () => {
    const { sut, authenticationSpy } = MakeSut()
    const error = new InvalidCredentialsError()
    jest.spyOn(authenticationSpy, 'auth').mockRejectedValueOnce(error) // Promise.reject(error)
    simulateValidSubmit(sut)
    const errorWrap = sut.getByTestId('errorWrap')
    await waitFor(() => errorWrap)
    const mainError = sut.getByTestId('main-error')
    expect(mainError.textContent).toBe(error.message)
    expect(errorWrap.childElementCount).toBe(1)
  })

  test('Should add accessToken to localstorage on success', async () => {
    const { sut, authenticationSpy } = MakeSut()
    simulateValidSubmit(sut)
    await waitFor(() => sut.getByTestId('form'))
    expect(localStorage.setItem).toHaveBeenCalledWith('accessToken', authenticationSpy.account.accessToken)
  })
})

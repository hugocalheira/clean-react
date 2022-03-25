import React from 'react'
import { cleanup, fireEvent, render, RenderResult } from '@testing-library/react'
// import { Login } from '@/presentation/pages'
import Login from '@/presentation/pages/login/login'
import { ValidationSpy } from '@/presentation/test'

type SutTypes = {
  sut: RenderResult
  validationSpy: ValidationSpy
}

const MakeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy()
  const sut = render(<Login validation={validationSpy} />)
  return {
    sut,
    validationSpy
  }
}

describe('Login Component', () => {
  afterEach(cleanup)
  test('Should start with initial state', () => {
    const { sut } = MakeSut()
    const { getByTestId, getByText } = sut

    const errorWrap = getByTestId('errorWrap')
    expect(errorWrap.childElementCount).toBe(0)

    const submitButton = getByText(/Entrar/i).closest('button')
    expect(submitButton.disabled).toBe(true)

    const emailStatus = getByTestId('email-status')
    expect(emailStatus.title).toBe('Campo obrigatório')
    expect(emailStatus.textContent).toBe('🔴')

    const passwordStatus = getByTestId('password-status')
    expect(passwordStatus.title).toBe('Campo obrigatório')
    expect(passwordStatus.textContent).toBe('🔴')
  })

  test('Should call Validation with correct email', () => {
    const { sut, validationSpy } = MakeSut()
    // const emailInput = sut.getByTestId('email')
    const emailInput = sut.getByPlaceholderText('Digite seu e-mail')
    fireEvent.input(emailInput, { target: { value: 'any_email' } })
    expect(validationSpy.fieldName).toEqual('email')
    expect(validationSpy.fieldValue).toEqual('any_email')
  })

  test('Should call Validation with correct password', () => {
    const { sut, validationSpy } = MakeSut()
    const passwordInput = sut.getByPlaceholderText('Digite sua senha')
    fireEvent.input(passwordInput, { target: { value: 'any_password' } })
    expect(validationSpy.fieldName).toEqual('password')
    expect(validationSpy.fieldValue).toEqual('any_password')
  })
})

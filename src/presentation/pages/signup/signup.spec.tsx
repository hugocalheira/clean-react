import React from 'react'
import { render, RenderResult } from '@testing-library/react'
import SignUp from './signup'
import { BrowserRouter } from 'react-router-dom'
import { Helper } from '@/presentation/test'

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

describe('SignUp Component', () => {
  test('Should start with initial state', () => {
    const validationError = 'Campo obrigatório'
    const { sut } = MakeSut()
    Helper.testButtonIsDisabled(sut, /Entrar/i)
    Helper.testChildCount(sut, 'errorWrap', 0)
    Helper.testStatusForField(sut, 'name', validationError)
    Helper.testStatusForField(sut, 'email', validationError)
    Helper.testStatusForField(sut, 'password', validationError)
    Helper.testStatusForField(sut, 'passwordConfirmation', validationError)
  })
})

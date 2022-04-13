import React from 'react'
import { cleanup, render, RenderResult } from '@testing-library/react'
import SignUp from './signup'
import { BrowserRouter } from 'react-router-dom'
import { Helper, ValidationStub } from '@/presentation/test'
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
  const sut = render(
    <BrowserRouter>
        <SignUp
            validation={validationStub}
        />
    </BrowserRouter>
  )
  return { sut }
}

describe('SignUp Component', () => {
  afterEach(cleanup)

  test('Should start with initial state', () => {
    const validationError = faker.random.words()
    const { sut } = MakeSut({ validationError })
    Helper.testButtonIsDisabled(sut, /Entrar/i)
    Helper.testChildCount(sut, 'errorWrap', 0)
    Helper.testStatusForField(sut, 'name', validationError)
    Helper.testStatusForField(sut, 'email', validationError)
    Helper.testStatusForField(sut, 'password', validationError)
    Helper.testStatusForField(sut, 'passwordConfirmation', validationError)
  })

  test('Should show name error if Validation fails', () => {
    const validationError = faker.random.words()
    const { sut } = MakeSut({ validationError })
    Helper.populateField(sut, 'name')
    Helper.testStatusForField(sut, 'name', validationError)
  })

  test('Should show email error if Validation fails', () => {
    const validationError = faker.random.words()
    const { sut } = MakeSut({ validationError })
    Helper.populateField(sut, 'email')
    Helper.testStatusForField(sut, 'email', validationError)
  })

  test('Should show password error if Validation fails', () => {
    const validationError = faker.random.words()
    const { sut } = MakeSut({ validationError })
    Helper.populateField(sut, 'password')
    Helper.testStatusForField(sut, 'password', validationError)
  })

  test('Should show passwordConfirmation error if Validation fails', () => {
    const validationError = faker.random.words()
    const { sut } = MakeSut({ validationError })
    Helper.populateField(sut, 'passwordConfirmation')
    Helper.testStatusForField(sut, 'passwordConfirmation', validationError)
  })

  test('Should show valid status if name Validation succeeds', () => {
    const { sut } = MakeSut()
    Helper.populateField(sut, 'name')
    Helper.testStatusForField(sut, 'name')
  })

  test('Should show valid status if email Validation succeeds', () => {
    const { sut } = MakeSut()
    Helper.populateField(sut, 'email')
    Helper.testStatusForField(sut, 'email')
  })
})

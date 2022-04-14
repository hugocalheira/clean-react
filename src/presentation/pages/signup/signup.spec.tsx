import React from 'react'
import { act, cleanup, fireEvent, render, RenderResult, waitFor } from '@testing-library/react'
import SignUp from './signup'
import { BrowserRouter } from 'react-router-dom'
import { AddAccountSpy, Helper, SaveAccessTokenMock, ValidationStub } from '@/presentation/test'
import faker from '@faker-js/faker'
import { EmailInUseError } from '@/domain/errors'

type SutTypes = {
  sut: RenderResult
  addAccountSpy: AddAccountSpy
  saveAccessTokenMock: SaveAccessTokenMock
}

type SutParams = {
  validationError: string
}

const MakeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub()
  const addAccountSpy = new AddAccountSpy()
  validationStub.errorMessage = params?.validationError
  const saveAccessTokenMock = new SaveAccessTokenMock()
  const sut = render(
    <BrowserRouter>
        <SignUp
            validation={validationStub}
            addAccount={addAccountSpy}
            saveAccessToken={saveAccessTokenMock}
        />
    </BrowserRouter>
  )
  return { sut, addAccountSpy, saveAccessTokenMock }
}

const simulateValidSubmit = async (sut: RenderResult, name = faker.name.findName(), email = faker.internet.email(), password = faker.internet.password()): Promise<void> => {
  Helper.populateField(sut, 'name', name)
  Helper.populateField(sut, 'email', email)
  Helper.populateField(sut, 'password', password)
  Helper.populateField(sut, 'passwordConfirmation', password)
  const form = sut.getByTestId('form')
  fireEvent.submit(form)
  await waitFor(() => form)
}

// pay attention to write it at the top level of your file
const mockedUsedNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  ...jest.requireActual('react-router-dom') as any,
  useNavigate: () => mockedUsedNavigate
}))

describe('SignUp Component', () => {
  afterEach(cleanup)

  test('Should start with initial state', () => {
    const validationError = faker.random.words()
    const { sut } = MakeSut({ validationError })
    Helper.testButtonIsDisabled(sut, 'submit')
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

  test('Should show valid status if password Validation succeeds', () => {
    const { sut } = MakeSut()
    Helper.populateField(sut, 'password')
    Helper.testStatusForField(sut, 'password')
  })

  test('Should show valid status if passwordConfirmation Validation succeeds', () => {
    const { sut } = MakeSut()
    Helper.populateField(sut, 'passwordConfirmation')
    Helper.testStatusForField(sut, 'passwordConfirmation')
  })

  test('Should enable submit button if form is valid', () => {
    const { sut } = MakeSut()
    Helper.populateField(sut, 'name')
    Helper.populateField(sut, 'email')
    Helper.populateField(sut, 'password')
    Helper.populateField(sut, 'passwordConfirmation')
    Helper.testButtonIsDisabled(sut, 'submit', false)
  })

  test('Should show spinner on submit', async () => {
    const { sut } = MakeSut()
    await simulateValidSubmit(sut)
    Helper.testElementExist(sut, 'spinner')
  })

  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccountSpy } = MakeSut()
    const name = faker.name.findName()
    const email = faker.internet.email()
    const password = faker.internet.password()
    await simulateValidSubmit(sut, name, email, password)
    expect(addAccountSpy.params).toEqual({
      name,
      email,
      password,
      passwordConfirmation: password
    })
  })

  test('Should call AddAccount only once', async () => {
    const { sut, addAccountSpy } = MakeSut()
    await simulateValidSubmit(sut)
    await simulateValidSubmit(sut)
    expect(addAccountSpy.callsCount).toBe(1)
  })

  test('Should not call AddAccount if form is invalid', async () => {
    const validationError = faker.random.words()
    const { sut: sutWithValidationError, addAccountSpy } = MakeSut({ validationError })
    await simulateValidSubmit(sutWithValidationError)
    expect(addAccountSpy.callsCount).toBe(0)
  })

  test('Should present error if AddAccount fails', async () => {
    const { sut, addAccountSpy } = MakeSut()
    const error = new EmailInUseError()
    jest.spyOn(addAccountSpy, 'add').mockReturnValueOnce(Promise.reject(error))
    await simulateValidSubmit(sut)
    await Helper.testElementText(sut, 'main-error', error.message)
    Helper.testChildCount(sut, 'errorWrap', 1)
  })

  test('Should call SaveAccessToken with correct params on success', async () => {
    const { sut, addAccountSpy, saveAccessTokenMock } = MakeSut()
    await simulateValidSubmit(sut)
    expect(saveAccessTokenMock.accessToken)
      .toBe(addAccountSpy.account.accessToken)
    expect(mockedUsedNavigate)
      .toHaveBeenCalledWith('/', { replace: true })
  })

  test('Should present error if SaveAccessToken fails', async () => {
    const { sut, saveAccessTokenMock } = MakeSut()
    const error = new EmailInUseError()
    jest.spyOn(saveAccessTokenMock, 'save').mockReturnValueOnce(Promise.reject(error))
    await act(async () => await simulateValidSubmit(sut))
    await Helper.testElementText(sut, 'main-error', error.message)
    Helper.testChildCount(sut, 'errorWrap', 1)
  })

  test('Should navigate to /login', () => {
    const { sut } = MakeSut()
    const login = sut.getByTestId('login-link')
    fireEvent.click(login)
    expect(mockedUsedNavigate).toHaveBeenCalledWith('/login')
  })
})

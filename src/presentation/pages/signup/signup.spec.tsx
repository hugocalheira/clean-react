import React from 'react'
import { cleanup, fireEvent, render, RenderResult, waitFor } from '@testing-library/react'
import SignUp from './signup'
import { BrowserRouter } from 'react-router-dom'
import { AddAccountSpy, Helper, ValidationStub } from '@/presentation/test'
import faker from '@faker-js/faker'
import { EmailInUseError } from '@/domain/errors'
import { AccountModel } from '@/domain/models'
import { ApiContext } from '@/presentation/contexts'

type SutTypes = {
  sut: RenderResult
  addAccountSpy: AddAccountSpy
  setCurrentAccountMock: (account: AccountModel) => void
}

type SutParams = {
  validationError: string
}

const MakeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub()
  const addAccountSpy = new AddAccountSpy()
  validationStub.errorMessage = params?.validationError
  const setCurrentAccountMock = jest.fn()
  const sut = render(
    <ApiContext.Provider value={{ setCurrentAccount: setCurrentAccountMock }}>
      <BrowserRouter>
          <SignUp
              validation={validationStub}
              addAccount={addAccountSpy}
          />
      </BrowserRouter>
    </ApiContext.Provider>
  )
  return { sut, addAccountSpy, setCurrentAccountMock }
}

const simulateValidSubmit = async (sut: RenderResult, name = faker.name.findName(), email = faker.internet.email(), password = faker.internet.password()): Promise<void> => {
  Helper.populateField('name', name)
  Helper.populateField('email', email)
  Helper.populateField('password', password)
  Helper.populateField('passwordConfirmation', password)
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
    MakeSut({ validationError })
    Helper.testButtonIsDisabled('submit')
    Helper.testChildCount('errorWrap', 0)
    Helper.testStatusForField('name', validationError)
    Helper.testStatusForField('email', validationError)
    Helper.testStatusForField('password', validationError)
    Helper.testStatusForField('passwordConfirmation', validationError)
  })

  test('Should show name error if Validation fails', () => {
    const validationError = faker.random.words()
    MakeSut({ validationError })
    Helper.populateField('name')
    Helper.testStatusForField('name', validationError)
  })

  test('Should show email error if Validation fails', () => {
    const validationError = faker.random.words()
    MakeSut({ validationError })
    Helper.populateField('email')
    Helper.testStatusForField('email', validationError)
  })

  test('Should show password error if Validation fails', () => {
    const validationError = faker.random.words()
    MakeSut({ validationError })
    Helper.populateField('password')
    Helper.testStatusForField('password', validationError)
  })

  test('Should show passwordConfirmation error if Validation fails', () => {
    const validationError = faker.random.words()
    MakeSut({ validationError })
    Helper.populateField('passwordConfirmation')
    Helper.testStatusForField('passwordConfirmation', validationError)
  })

  test('Should show valid status if name Validation succeeds', () => {
    MakeSut()
    Helper.populateField('name')
    Helper.testStatusForField('name')
  })

  test('Should show valid status if email Validation succeeds', () => {
    MakeSut()
    Helper.populateField('email')
    Helper.testStatusForField('email')
  })

  test('Should show valid status if password Validation succeeds', () => {
    MakeSut()
    Helper.populateField('password')
    Helper.testStatusForField('password')
  })

  test('Should show valid status if passwordConfirmation Validation succeeds', () => {
    MakeSut()
    Helper.populateField('passwordConfirmation')
    Helper.testStatusForField('passwordConfirmation')
  })

  test('Should enable submit button if form is valid', () => {
    MakeSut()
    Helper.populateField('name')
    Helper.populateField('email')
    Helper.populateField('password')
    Helper.populateField('passwordConfirmation')
    Helper.testButtonIsDisabled('submit', false)
  })

  test('Should show spinner on submit', async () => {
    const { sut } = MakeSut()
    await simulateValidSubmit(sut)
    Helper.testElementExist('spinner')
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
    await Helper.testElementText('main-error', error.message)
    Helper.testChildCount('errorWrap', 1)
  })

  test('Should call setCurrentAccountMock with correct params on success', async () => {
    const { sut, addAccountSpy, setCurrentAccountMock } = MakeSut()
    await simulateValidSubmit(sut)
    expect(setCurrentAccountMock).toHaveBeenCalledWith(addAccountSpy.account)
    expect(mockedUsedNavigate).toHaveBeenCalledWith('/', { replace: true })
  })

  test('Should navigate to /login', () => {
    const { sut } = MakeSut()
    const login = sut.getByTestId('login-link')
    fireEvent.click(login)
    expect(mockedUsedNavigate).toHaveBeenCalledWith('/login')
  })
})

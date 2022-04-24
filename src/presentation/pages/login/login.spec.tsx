import React from 'react'
import { act, cleanup, fireEvent, render, RenderResult, waitFor } from '@testing-library/react'
import { Login } from '@/presentation/pages'
import { Helper, ValidationStub, AuthenticationSpy, UpdateCurrentAccountMock } from '@/presentation/test'
import faker from '@faker-js/faker'
import { InvalidCredentialsError } from '@/domain/errors'
import { BrowserRouter } from 'react-router-dom'

type SutTypes = {
  sut: RenderResult
  authenticationSpy: AuthenticationSpy
  updateCurrentAccountMock: UpdateCurrentAccountMock
}

type SutParams = {
  validationError: string
}

const MakeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub()
  const authenticationSpy = new AuthenticationSpy()
  validationStub.errorMessage = params?.validationError
  const updateCurrentAccountMock = new UpdateCurrentAccountMock()
  const sut = render(
    // <MemoryRouter initialEntries={["/users/mjackson"]}></MemoryRouter>
    <BrowserRouter>
      <Login
        validation={validationStub}
        authentication={authenticationSpy}
        updateCurrentAccount={updateCurrentAccountMock}
      />
    </BrowserRouter>
  )
  return { sut, authenticationSpy, updateCurrentAccountMock }
}

const simulateValidSubmit = async (sut: RenderResult, email = faker.internet.email(), password = faker.internet.password()): Promise<void> => {
  Helper.populateField('email', email)
  Helper.populateField('password', password)
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

describe('Login Component', () => {
  afterEach(cleanup)
  test('Should start with initial state', () => {
    const validationError = faker.random.words()
    MakeSut({ validationError })
    Helper.testChildCount('errorWrap', 0)
    Helper.testButtonIsDisabled('submit')
    Helper.testStatusForField('email', validationError)
    Helper.testStatusForField('password', validationError)
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

  test('Should enable submit button if form is valid', () => {
    MakeSut()
    Helper.populateField('email')
    Helper.populateField('password')
    Helper.testButtonIsDisabled('submit', false)
  })

  test('Should show spinner on submit', async () => {
    const { sut } = MakeSut()
    await simulateValidSubmit(sut)
    Helper.testElementExist('spinner')
  })

  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationSpy } = MakeSut()
    const email = faker.internet.email()
    const password = faker.internet.password()
    await simulateValidSubmit(sut, email, password)
    expect(authenticationSpy.params).toEqual({ email, password })
  })

  test('Should call Authentication only once', async () => {
    const { sut, authenticationSpy } = MakeSut()
    await simulateValidSubmit(sut)
    await simulateValidSubmit(sut)
    expect(authenticationSpy.callsCount).toBe(1)
  })

  test('Should not call Authentication if form is invalid', async () => {
    const validationError = faker.random.words()
    const { sut: sutWithValidationError, authenticationSpy } = MakeSut({ validationError })
    await simulateValidSubmit(sutWithValidationError)
    expect(authenticationSpy.callsCount).toBe(0)
  })

  test('Should present error if Authentication fails', async () => {
    const { sut, authenticationSpy } = MakeSut()
    const error = new InvalidCredentialsError()
    jest.spyOn(authenticationSpy, 'auth').mockReturnValueOnce(Promise.reject(error))
    await simulateValidSubmit(sut)
    await Helper.testElementText('main-error', error.message)
    Helper.testChildCount('errorWrap', 1)
  })

  test('Should call UpdateCurrentAccount with correct params on success', async () => {
    const { sut, authenticationSpy, updateCurrentAccountMock } = MakeSut()
    await simulateValidSubmit(sut)
    expect(updateCurrentAccountMock.account).toEqual(authenticationSpy.account)
    expect(mockedUsedNavigate)
      .toHaveBeenCalledWith('/', { replace: true })
  })

  test('Should present error if UpdateCurrentAccount fails', async () => {
    const { sut, updateCurrentAccountMock } = MakeSut()
    const error = new InvalidCredentialsError()
    jest.spyOn(updateCurrentAccountMock, 'save').mockReturnValueOnce(Promise.reject(error))
    await act(async () => await simulateValidSubmit(sut))
    await Helper.testElementText('main-error', error.message)
    Helper.testChildCount('errorWrap', 1)
  })

  test('Should navigate to /signup', () => {
    const { sut } = MakeSut()
    const signup = sut.getByTestId('signup-link')
    fireEvent.click(signup)
    expect(mockedUsedNavigate).toHaveBeenCalledWith('/signup')
  })
})

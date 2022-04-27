import React from 'react'
import { fireEvent, render, screen } from "@testing-library/react"
import { ApiContext } from '@/presentation/contexts'
import Header from "./header"
import 'jest-localstorage-mock'
import { BrowserRouter } from 'react-router-dom'
import { AccountModel } from '@/domain/models'
import { mockAccountModel } from '@/domain/test'

// pay attention to write it at the top level of your file
const mockedUsedNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  ...jest.requireActual('react-router-dom') as any,
  useNavigate: () => mockedUsedNavigate
}))

type SutTypes = {
  setCurrentAccountMock: (accont: AccountModel) => void
}

const makeSut = (account = mockAccountModel()): SutTypes => {
  const setCurrentAccountMock = jest.fn()
  const sut = render(
    <ApiContext.Provider value={{ 
      setCurrentAccount: setCurrentAccountMock,
      getCurrentAccount: () => account }}>
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    </ApiContext.Provider>
  )
  return {
    setCurrentAccountMock
  }
}

describe('Header Component', () => {
  test('Should call SetCurrentAccount with null', () => {
    const {setCurrentAccountMock} = makeSut()
    fireEvent.click(screen.getByTestId('logout'))
    expect(setCurrentAccountMock).toHaveBeenCalledWith(null)
    expect(mockedUsedNavigate).toHaveBeenCalledWith('/login', { replace: true })
  })

  test('Should render user name correctly', () => {
    const account = mockAccountModel()
    makeSut(account)
    expect(screen.getByTestId('username')).toHaveTextContent(account.name)
  })
})

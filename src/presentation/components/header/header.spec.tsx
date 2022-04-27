import React from 'react'
import { fireEvent, render } from "@testing-library/react"
import { ApiContext } from '@/presentation/contexts'
import Header from "./header"
import 'jest-localstorage-mock'
import { BrowserRouter } from 'react-router-dom'

// pay attention to write it at the top level of your file
const mockedUsedNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  ...jest.requireActual('react-router-dom') as any,
  useNavigate: () => mockedUsedNavigate
}))

describe('Header Component', () => {
  test('Should call SetCurrentAccount with null', () => {
    const setCurrentAccountMock = jest.fn()
    const sut = render(
      <ApiContext.Provider value={{ setCurrentAccount: setCurrentAccountMock }}>
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      </ApiContext.Provider>
    )
    fireEvent.click(sut.getByTestId('logout'))
    expect(setCurrentAccountMock).toHaveBeenCalledWith(null)
    expect(mockedUsedNavigate).toHaveBeenCalledWith('/login', { replace: true })
  })
})
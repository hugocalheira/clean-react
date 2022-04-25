import { render } from '@testing-library/react'
import React from 'react'
import { PrivateRoute } from '@/presentation/components'
import { BrowserRouter } from 'react-router-dom'

// pay attention to write it at the top level of your file
const mockedUsedNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  ...jest.requireActual('react-router-dom') as any,
  useNavigate: () => mockedUsedNavigate
}))

const makeSut = (): void => {
  render(
    <BrowserRouter >
      <PrivateRoute />
    </BrowserRouter>
  )
}

describe('PrivateRoute', () => {
  test('Should redirect to /login if token is empty', () => {
    makeSut()
    expect(mockedUsedNavigate).toHaveBeenCalledWith('/login', { replace: true })
  })
})

import { render } from '@testing-library/react'
import React from 'react'
import { PrivateRoute } from '@/presentation/components'
import { BrowserRouter } from 'react-router-dom'
// import { createMemoryHistory } from 'history'

// pay attention to write it at the top level of your file
const mockedUsedNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  ...jest.requireActual('react-router-dom') as any,
  useNavigate: () => mockedUsedNavigate
}))

describe('PrivateRoute', () => {
  test('Should redirect to /login if token is empty', () => {
    render(
        <BrowserRouter >
          <PrivateRoute />
        </BrowserRouter>
    )
    expect(mockedUsedNavigate).toHaveBeenCalledWith('/login', { replace: true })
  })
})

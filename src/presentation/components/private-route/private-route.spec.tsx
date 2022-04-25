import { render, screen } from '@testing-library/react'
import React from 'react'
import { PrivateRoute } from '@/presentation/components'
import { BrowserRouter } from 'react-router-dom'
import { ApiContext } from '@/presentation/contexts'
import { AccountModel } from '@/domain/models'
import { mockAccountModel } from '@/domain/test'
import faker from '@faker-js/faker'

// pay attention to write it at the top level of your file
const mockedUsedNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  ...jest.requireActual('react-router-dom') as any,
  useNavigate: () => mockedUsedNavigate
}))

const makeSut = (account: AccountModel = mockAccountModel()): {textContent: string, componentId: string} => {
  const getCurrentAccountMock = jest.fn().mockReturnValueOnce(account)
  const textContent = faker.random.word()
  const componentId = faker.datatype.uuid()
  render(
    <ApiContext.Provider value={{ getCurrentAccount: getCurrentAccountMock }}>
      <BrowserRouter >
        <PrivateRoute component={() => <div data-testid={componentId}>{textContent}</div>}/>
      </BrowserRouter>
    </ApiContext.Provider>
  )
  return { textContent, componentId }
}

describe('PrivateRoute', () => {
  afterEach(jest.clearAllMocks)
  test('Should redirect to /login if token is empty', () => {
    makeSut(null)
    expect(mockedUsedNavigate).toHaveBeenCalledWith('/login', { replace: true })
  })

  test('Should render current component if token is not empty', () => {
    const { componentId, textContent } = makeSut()
    const Element = screen.getByTestId(componentId)
    expect(mockedUsedNavigate).not.toHaveBeenCalledWith('/login', { replace: true })
    expect(Element.textContent).toBe(textContent)
  })
})

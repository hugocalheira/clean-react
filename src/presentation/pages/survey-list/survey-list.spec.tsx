import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { LoadSurveyListSpy, mockAccountModel } from '@/domain/test'
import { AccountModel } from '@/domain/models'
import { AccessDeniedError, UnexpectedError } from '@/domain/errors'
import { ApiContext } from '@/presentation/contexts'
import SurveyList from './survey-list'

type SutTypes = {
  loadSurveyListSpy: LoadSurveyListSpy
  setCurrentAccountMock: (accont: AccountModel) => void
}

const makeSut = (loadSurveyListSpy = new LoadSurveyListSpy()): SutTypes => {
  const setCurrentAccountMock = jest.fn()
  render(
    <ApiContext.Provider value={{
      setCurrentAccount: setCurrentAccountMock,
      getCurrentAccount: mockAccountModel
    }}>
      <BrowserRouter>
      <SurveyList loadSurveylist={loadSurveyListSpy} />
      </BrowserRouter>
    </ApiContext.Provider>
  )
  return {
    loadSurveyListSpy,
    setCurrentAccountMock
  }
}

// pay attention to write it at the top level of your file
const mockedUsedNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  ...jest.requireActual('react-router-dom') as any,
  useNavigate: () => mockedUsedNavigate
}))

describe('SurveyList Component', () => {
  test('Should present 4 empty items on start', async () => {
    makeSut()
    const surveyList = screen.getByTestId('survey-list')
    expect(surveyList.querySelectorAll('li')).toHaveLength(4)
    expect(surveyList.querySelectorAll('li:empty')).toHaveLength(4)
    expect(screen.queryByTestId('error')).not.toBeInTheDocument()
    await waitFor(() => surveyList)
  })

  test('Should call LoadSurveyList', async () => {
    const { loadSurveyListSpy } = makeSut()
    expect(loadSurveyListSpy.callsCount).toBe(1)
    await waitFor(() => screen.getByRole('heading'))
  })

  test('Should render SurveyItems on success', async () => {
    const { loadSurveyListSpy } = makeSut()
    const { surveys } = loadSurveyListSpy
    const surveyList = screen.queryByTestId('survey-list')
    // await waitFor(() => surveyList)
    await screen.findByText(surveys[0].question)
    expect(surveyList.querySelectorAll('li.surveyItemWrap')).toHaveLength(surveys.length)
    expect(screen.queryByTestId('error')).not.toBeInTheDocument()
  })

  test('Should render error on UnexpectedError', async () => {
    const unexpectedError = new UnexpectedError()
    const loadSurveyListSpy = new LoadSurveyListSpy()
    jest.spyOn(loadSurveyListSpy, 'loadAll').mockRejectedValueOnce(unexpectedError)
    makeSut(loadSurveyListSpy)
    // await waitFor(() => screen.getByRole('heading'))
    await screen.findByText(unexpectedError.message)
    expect(screen.queryByTestId('survey-list')).not.toBeInTheDocument()
    expect(screen.getByTestId('error')).toHaveTextContent(unexpectedError.message)
  })

  test('Should logout on AccessDeniedError', async () => {
    const accessDeniedError = new AccessDeniedError()
    const loadSurveyListSpy = new LoadSurveyListSpy()
    jest.spyOn(loadSurveyListSpy, 'loadAll').mockRejectedValueOnce(accessDeniedError)
    const { setCurrentAccountMock } = makeSut(loadSurveyListSpy)

    await screen.findByText(accessDeniedError.message)
    expect(screen.queryByTestId('survey-list')).not.toBeInTheDocument()
    expect(screen.getByTestId('error')).toHaveTextContent(accessDeniedError.message)
    expect(setCurrentAccountMock).toHaveBeenCalledWith(null)
    expect(mockedUsedNavigate).toHaveBeenCalledWith('/login', { replace: true })
  })

  test('Should call LoadSurveyList on reload', async () => {
    const unexpectedError = new UnexpectedError()
    const loadSurveyListSpy = new LoadSurveyListSpy()
    jest.spyOn(loadSurveyListSpy, 'loadAll').mockRejectedValueOnce(unexpectedError)
    makeSut(loadSurveyListSpy)

    await screen.findByText(unexpectedError.message)
    fireEvent.click(screen.getByTestId('reload'))
    await waitFor(() => screen.getByRole('heading'))
    expect(loadSurveyListSpy.callsCount).toBe(1)
    expect(screen.queryByTestId('error')).not.toBeInTheDocument()
  })
})

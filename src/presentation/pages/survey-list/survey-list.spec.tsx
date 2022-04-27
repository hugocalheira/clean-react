import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { LoadSurveyListSpy } from '@/domain/test'
import SurveyList from './survey-list'
import { UnexpectedError } from '@/domain/errors'

type SutTypes = {
  loadSurveyListSpy: LoadSurveyListSpy
}

const makeSut = (loadSurveyListSpy = new LoadSurveyListSpy()): SutTypes => {
  render(<SurveyList loadSurveylist={loadSurveyListSpy} />)
  return {
    loadSurveyListSpy
  }
}

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

  test('Should render error on failure', async () => {
    const unexpectedError = new UnexpectedError()
    const loadSurveyListSpy = new LoadSurveyListSpy()
    jest.spyOn(loadSurveyListSpy, 'loadAll').mockRejectedValueOnce(unexpectedError)
    makeSut(loadSurveyListSpy)
    // await waitFor(() => screen.getByRole('heading'))
    await screen.findByText(unexpectedError.message)
    expect(screen.queryByTestId('survey-list')).not.toBeInTheDocument()
    expect(screen.getByTestId('error')).toHaveTextContent(unexpectedError.message)
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

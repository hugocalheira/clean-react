import React from 'react'
import { render, screen } from '@testing-library/react'
import SurveyList from './survey-list'
import { LoadSurveyList } from '@/domain/usecases'
import { SurveyModel } from '@/domain/models'

type SutTypes = {
  loadSurveyListSpy: LoadSurveyListSpy
}

class LoadSurveyListSpy implements LoadSurveyList {
    callsCount = 0
    async loadAll (): Promise<SurveyModel[]> {
      this.callsCount++
      return []
    };
}

const makeSut = (): SutTypes => {
  const loadSurveyListSpy = new LoadSurveyListSpy()
  render(<SurveyList loadSurveylist={loadSurveyListSpy} />)
  return {
    loadSurveyListSpy
  }
}

describe('SurveyList Component', () => {
  test('Should present 4 empty items on start', () => {
    makeSut()
    const surveyList = screen.getByTestId('survey-list')
    expect(surveyList.querySelectorAll('li').length).toBe(4)
    expect(surveyList.querySelectorAll('li:empty').length).toBe(4)
  })

  test('Should call LoadSurveyList', () => {
    const { loadSurveyListSpy } = makeSut()
    expect(loadSurveyListSpy.callsCount).toBe(1)
  })
})

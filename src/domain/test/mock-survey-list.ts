import faker from '@faker-js/faker'
import { LoadSurveyList } from '@/domain/usecases'

export const mockSurveyModel = (): LoadSurveyList.Model => {
  return {
    id: faker.datatype.uuid(),
    question: faker.random.words(10),
    date: faker.date.recent(),
    didAnswer: (Math.random() > 0.5)
  }
}

export const mockSurveyListModel = (): LoadSurveyList.Model[] => {
  const randomNumber = Math.ceil(Math.random() * 5)
  return [...Array(randomNumber)].map(() => mockSurveyModel())
}

export class LoadSurveyListSpy implements LoadSurveyList {
  callsCount = 0
  surveys = mockSurveyListModel()
  async loadAll (): Promise<LoadSurveyList.Model[]> {
    this.callsCount++
    return this.surveys
  };
}

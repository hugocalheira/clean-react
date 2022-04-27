import { RemoteLoadSurveyList } from '@/data/usecases'
import faker from '@faker-js/faker'

export const mockRemoteSurveyModel = (): RemoteLoadSurveyList.Model => {
  return {
    id: faker.datatype.uuid(),
    question: faker.random.words(10),
    date: faker.date.recent().toISOString(),
    didAnswer: (Math.random() > 0.5)
  }
}

export const mockRemoteSurveyListModel = (): RemoteLoadSurveyList.Model[] => {
  const randomNumber = Math.ceil(Math.random() * 5)
  return [...Array(randomNumber)].map(() => mockRemoteSurveyModel())
}

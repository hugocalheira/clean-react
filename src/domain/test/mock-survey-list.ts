import { SurveyModel } from '../models'
import faker from '@faker-js/faker'

export const mockSurveyListModel = (): SurveyModel[] => {
  const imageDimension = 200
  return [
    {
      id: faker.datatype.uuid(),
      question: faker.random.words(10),
      answers: [
        {
          image: faker.image.food(imageDimension,imageDimension),
          answer: faker.random.words(4)
        },
        {
          answer: faker.random.words(5)
        },
        {
          image: faker.image.cats(imageDimension,imageDimension),
          answer: faker.animal.cat()
        }
      ],
      date: faker.date.recent(),
      didAnswer: (Math.random() > 0.5)
    }
  ]
}

import React, { useEffect, useState } from 'react'
import { LoadSurveyList } from '@/domain/usecases'
import { Footer, Header } from '@/presentation/components'
import { SurveyItemEmpty, SurveyItem } from '@/presentation/pages/survey-list/components'
import Styles from './survey-list-styles.scss'
import { SurveyModel } from '@/domain/models'

type Props = {
  loadSurveylist: LoadSurveyList
}

const SurveyList: React.FC<Props> = ({ loadSurveylist }: Props) => {
  const [state, setState] = useState({
    surveys: [] as SurveyModel[],
    error: null
  })
  useEffect(() => {
    loadSurveylist.loadAll()
      .then(surveys => setState({ ...state, surveys }))
      .catch(error => setState({ ...state, error: error.message }))
  },[])

  return (
      <div className={Styles.surveyListWrap}>
          <Header />
          <div className={Styles.contentWrap}>
            <h2>Enquetes</h2>
            { state.error
              ? (
              <div>
                <span data-testid="error">{state.error}</span>
                <button>Recarregar</button>
              </div>
                )
              : (
              <ul data-testid="survey-list">
                { state.surveys.length
                  ? state.surveys.map((survey: SurveyModel) => <SurveyItem key={survey.id} survey={survey}/>)
                  : <SurveyItemEmpty />
                }
              </ul>
                )
            }
          </div>
          <Footer />
      </div>
  )
}

export default SurveyList

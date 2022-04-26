import React, { useEffect } from 'react'
import { LoadSurveyList } from '@/domain/usecases'
import { Footer, Header } from '@/presentation/components'
import { SurveyItemEmpty } from '@/presentation/pages/survey-list/components'
import Styles from './survey-list-styles.scss'

type Props = {
  loadSurveylist: LoadSurveyList
}

const SurveyList: React.FC<Props> = ({ loadSurveylist }: Props) => {
  useEffect(() => {
    (async () => loadSurveylist.loadAll())()
  },[])

  return (
      <div className={Styles.surveyListWrap}>
          <Header />
          <div className={Styles.contentWrap}>
            <h2>Enquetes</h2>
            <ul data-testid="survey-list">
                <SurveyItemEmpty />
            </ul>
          </div>
          <Footer />
      </div>
  )
}

export default SurveyList

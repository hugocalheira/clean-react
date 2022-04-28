import React, { useEffect, useState } from 'react'
import { LoadSurveyList } from '@/domain/usecases'
import { Footer, Header } from '@/presentation/components'
import { SurveyContext, SurveyError, SurveyListItem } from '@/presentation/pages/survey-list/components'
import Styles from './survey-list-styles.scss'
import { useErrorHandler } from '@/presentation/hooks'

type Props = {
  loadSurveylist: LoadSurveyList
}

const SurveyList: React.FC<Props> = ({ loadSurveylist }: Props) => {
  const [state, setState] = useState({
    surveys: [] as LoadSurveyList.Model[],
    error: null,
    reload: null
  })
  const errorHandler = useErrorHandler((error: Error) => {
    setState({ ...state, error: error.message })
  })

  useEffect(() => {
    loadSurveylist.loadAll()
      .then(surveys => setState({ ...state, surveys }))
      .catch(errorHandler)
  },[state.reload])

  return (
    <div className={Styles.surveyListWrap}>
      <Header />
      <div className={Styles.contentWrap}>
        <h2>Enquetes</h2>
        <SurveyContext.Provider value={{ state, setState }}>
        { state.error ? <SurveyError /> : <SurveyListItem /> }
        </SurveyContext.Provider>
      </div>
      <Footer />
    </div>
  )
}

export default SurveyList

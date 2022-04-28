import React, { useContext, useEffect, useState } from 'react'
import { LoadSurveyList } from '@/domain/usecases'
import { Footer, Header } from '@/presentation/components'
import { SurveyContext, SurveyError, SurveyListItem } from '@/presentation/pages/survey-list/components'
import Styles from './survey-list-styles.scss'
import { ApiContext } from '@/presentation/contexts'
import { useNavigate } from 'react-router-dom'
import { AccessDeniedError } from '@/domain/errors'

type Props = {
  loadSurveylist: LoadSurveyList
}

const SurveyList: React.FC<Props> = ({ loadSurveylist }: Props) => {
  const [state, setState] = useState({
    surveys: [] as LoadSurveyList.Model[],
    error: null,
    reload: null
  })
  const { setCurrentAccount } = useContext(ApiContext)
  const navigate = useNavigate()

  useEffect(() => {
    loadSurveylist.loadAll()
      .then(surveys => setState({ ...state, surveys }))
      .catch(error => {
        setState({ ...state, error: error.message })
        if (error.name === new AccessDeniedError().name) {
          setCurrentAccount(null)
          navigate('/login', { replace: true })
        }
      })
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

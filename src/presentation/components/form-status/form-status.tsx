import React, { useContext, useEffect } from 'react'
import Spinner from '../spinner/spinner'
import Styles from './form-status-styles.scss'
import Context from '@/presentation/contexts/form/form-context'
import { UnexpectedError } from '@/domain/errors'

const FormStatus: React.FC = () => {
  const { state, setState } = useContext(Context)
  const { isLoading, mainError } = state

  const getQueryParamError = (): void => {
    const errorValue = new URLSearchParams(location.search).get('error')
    if (errorValue === 'invalidAccessToken') {
      const error = new UnexpectedError()
      setState({ ...state, mainError: error.message })
    }
  }

  useEffect(() => {
    getQueryParamError()
  },[state.mainError])

  return (
    <div data-testid='errorWrap' className={Styles.errorWrap}>
        {isLoading && <Spinner className={Styles.spinner}/>}
        {mainError && <span data-testid="main-error" className={Styles.error}>{mainError}</span>}
    </div>
  )
}

export default FormStatus

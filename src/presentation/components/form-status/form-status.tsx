import React, { useContext } from 'react'
import Spinner from '../spinner/spinner'
import Styles from './form-status-styles.scss'
import Context from '@/presentation/contexts/form/form-context'

const FormStatus: React.FC = () => {
  const { state } = useContext(Context)
  const { isLoading, mainError } = state
  return (
    <div data-testid='errorWrap' className={Styles.errorWrap}>
        {isLoading && <Spinner data-testid="spinner" className={Styles.spinner}/>}
        {mainError.length > 0 && <span className={Styles.error}>{mainError}</span>}
    </div>
  )
}

export default FormStatus

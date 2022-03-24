import React, { memo, useContext } from 'react'
import Styles from './input-styles.scss'
import Context from '@/presentation/contexts/form/form-context'

type Props = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

const Input: React.FC<Props> = (props: Props) => {
  const { errorState } = useContext(Context)
  const error = errorState[props.name]

  function enableInput (event: React.FocusEvent<HTMLInputElement>): void {
    event.target.readOnly = false
  }

  const getTitle = (): string => error

  const getStatus = (): string => '🔴'

  return (
    <div className={Styles.inputWrap}>
        <input {...props} autoComplete='off' readOnly onFocus={enableInput}/>
        <span
          title={getTitle()}
          data-testid={`${props.name}-status`}
          className={Styles.status}
        >{getStatus()}</span>
    </div>
  )
}

export default memo(Input)

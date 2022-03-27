import React, { memo, useContext } from 'react'
import Styles from './input-styles.scss'
import Context from '@/presentation/contexts/form/form-context'

type Props = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

const Input: React.FC<Props> = (props: Props) => {
  const { state, setState } = useContext(Context)
  const error = state[`${props.name}Error`]

  function enableInput (event: React.FocusEvent<HTMLInputElement>): void {
    event.target.readOnly = false
  }

  function handleChange (e: React.FocusEvent<HTMLInputElement>): void {
    setState(oldState => (
      { ...oldState, [props.name]: e.target.value }
    ))
  }

  const getTitle = (): string => error || 'Tudo certo!'

  const getStatus = (): string => error ? '🔴' : '🟢'

  return (
    <div className={Styles.inputWrap}>
        <input
          {...props}
          autoComplete='off'
          readOnly
          onFocus={enableInput}
          onChange={handleChange}
          value={state[props.name]}
        />
        <span
          title={getTitle()}
          data-testid={`${props.name}-status`}
          className={Styles.status}
        >{getStatus()}</span>
    </div>
  )
}

export default memo(Input)

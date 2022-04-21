/* eslint-disable react/prop-types */
import React, { memo, useContext } from 'react'
import Styles from './input-styles.scss'
import Context from '@/presentation/contexts/form/form-context'

type Props = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

const Input: React.FC<Props> = (props: Props) => {
  const { state, setState } = useContext(Context)
  const error = state[`${props.name}Error`]

  function handleChange (e: React.FocusEvent<HTMLInputElement>): void {
    setState(oldState => (
      { ...oldState, [props.name]: e.target.value }
    ))
  }

  return (
    <div className={Styles.inputWrap}>
        <input
          {...props}
          placeholder={' '}
          data-testid={props.name}
          autoComplete='off'
          readOnly
          onFocus={e => { e.target.readOnly = false }}
          onChange={handleChange}
        />
        <label>{props.placeholder}</label>
        <span
          title={error || 'Tudo certo!'}
          data-testid={`${props.name}-status`}
          className={Styles.status}
        >{error ? '🔴' : '🟢'}</span>
    </div>
  )
}

export default memo(Input)

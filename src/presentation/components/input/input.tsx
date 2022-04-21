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
    <div
      data-testid={`${props.name}-wrap`}
      className={Styles.inputWrap}
      data-status={ error ? 'invalid' : 'valid'}
    >
        <input
          {...props}
          title={error}
          placeholder={' '}
          data-testid={props.name}
          autoComplete='off'
          readOnly
          onFocus={e => { e.target.readOnly = false }}
          onChange={handleChange}
        />
        <label>{props.placeholder}</label>
    </div>
  )
}

export default memo(Input)

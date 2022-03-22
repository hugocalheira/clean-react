import React, { memo } from 'react'
import Styles from './input-styles.scss'

type Props = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

function enableInput (event: React.FocusEvent<HTMLInputElement>): void {
  event.target.readOnly = false
}

const Input: React.FC<Props> = (props: Props) => (
    <div className={Styles.inputWrap}>
        <input {...props} autoComplete='off' readOnly onFocus={enableInput}/>
        <span className={Styles.status}>🔴</span>
    </div>
)

export default memo(Input)

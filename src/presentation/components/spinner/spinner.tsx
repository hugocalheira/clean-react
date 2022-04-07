import React from 'react'
import Styles from './spinner-styles.scss'

type Props = React.HTMLAttributes<HTMLElement>

const Spinner: React.FC<Props> = (props: Props) => (
    // eslint-disable-next-line react/prop-types
    <div data-testid="spinner" {...props} className={[Styles.spinner, props.className].join(' ')}>
        <div/>
        <div/>
        <div/>
        <div/>
    </div>
)

export default Spinner

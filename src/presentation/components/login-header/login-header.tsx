import React, { memo } from 'react'
import Logo from '../logo/logo'
import Styles from './login-header-styles.scss'

type Props = React.HTMLAttributes<HTMLElement>

const LoginHeader: React.FC<Props> = (props: Props) => (
    // eslint-disable-next-line react/prop-types
    <header {...props} className={[Styles.header, props.className].join(' ')}>
        <Logo />
        <h1>4Dev - Enquetes para Programadores</h1>
    </header>
)

export default memo(LoginHeader)

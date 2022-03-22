import React from 'react'
import { Header, Input, Footer, FormStatus } from '@/presentation/components'
import Styles from './login-styles.scss'

const Login: React.FC = () => {
  return (
    <div className={Styles.login}>
        <Header />
        <form className={Styles.form}>
            <h2>Login</h2>

            <Input type='email' name='email' placeholder='Digite seu e-mail'/>
            <Input type='password' name='password' placeholder='Digite sua senha'/>
            <button type='submit'>Entrar</button>

            <span className={Styles.link}>Criar conta</span>
            <FormStatus />

        </form>
        <Footer />
    </div>
  )
}

export default Login

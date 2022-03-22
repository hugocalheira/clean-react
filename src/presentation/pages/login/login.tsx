import Header from '@/presentation/components/login-header/login-header'
import Spinner from '@/presentation/components/spinner/spinner'
import React from 'react'
import Styles from './login-styles.scss'

const Login: React.FC = () => {
  return (
    <div className={Styles.login}>
        <Header />
        <form className={Styles.form}>
            <h2>Login</h2>
            <div className={Styles.inputWrap}>
                <input type='email' name='email' placeholder='Digite seu e-mail' />
                <span className={Styles.status}>🔴</span>
            </div>
            <div className={Styles.inputWrap}>
                <input type='password' name='password' placeholder='Digite sua senha' />
                <span className={Styles.status}>🔴</span>
            </div>
            <button type='submit'>Entrar</button>
            <span className={Styles.link}>Criar conta</span>

            {/* error */}
            <div className={Styles.errorWrap}>
                <Spinner className={Styles.spinner}/>
                <span className={Styles.error}>Erro</span>
            </div>

        </form>
        <footer className={Styles.footer}/>
    </div>
  )
}

export default Login

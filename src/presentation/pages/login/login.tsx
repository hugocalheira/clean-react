import React, { useState } from 'react'
import { Header, Input, Footer, FormStatus } from '@/presentation/components'
import Styles from './login-styles.scss'
import Context from '@/presentation/contexts/form/form-context'

const Login: React.FC = () => {
  const [state] = useState({
    isLoading: false
  })

  const [errorState] = useState({
    main: '',
    email: 'Campo obrigatório',
    password: 'Campo obrigatório'
  })

  return (
    <div className={Styles.login}>
        <Header />
        <Context.Provider value={{ state, errorState }}>
          <form className={Styles.form}>
              <h2>Login</h2>

              <Input type='email' name='email' placeholder='Digite seu e-mail'/>
              <Input type='password' name='password' placeholder='Digite sua senha'/>
              <button data-testid='submitButton' type='submit' disabled>Entrar</button>

              <span className={Styles.link}>Criar conta</span>
              <FormStatus />

          </form>
        </Context.Provider>
        <Footer />
    </div>
  )
}

export default Login

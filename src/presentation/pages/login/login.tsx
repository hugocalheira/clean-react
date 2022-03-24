import React, { useState } from 'react'
import { Header, Input, Footer, FormStatus } from '@/presentation/components'
import Styles from './login-styles.scss'
import Context from '@/presentation/contexts/form/form-context'

type StateProps = {
  isLoading: boolean
  errorMessage: string
}

const Login: React.FC = () => {
  const [state] = useState<StateProps>({
    isLoading: false, errorMessage: ''
  })

  return (
    <div className={Styles.login}>
        <Header />
        <Context.Provider value={state}>
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

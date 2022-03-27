import React, { useEffect, useState } from 'react'
import { Header, Input, Footer, FormStatus } from '@/presentation/components'
import Styles from './login-styles.scss'
import Context from '@/presentation/contexts/form/form-context'
import { Validation } from '@/presentation/protocols/validation'

type Props = {
  validation: Validation
}

const Login: React.FC<Props> = ({ validation }: Props) => {
  const [state, setState] = useState({
    isLoading: false,
    email: '',
    password: '',
    emailError: '',
    passwordError: '',
    mainError: ''
  })

  function handleSubmit () {
    setState(oldState => ({
      ...oldState,
      isLoading: true
    }))
  }

  useEffect(() => {
    setState(oldState => ({
      ...oldState,
      emailError: validation.validate('email', oldState.email)
    }))
  }, [state.email])

  useEffect(() => {
    setState(oldState => ({
      ...oldState,
      passwordError: validation.validate('password', oldState.password)
    }))
  }, [state.password])

  return (
    <div className={Styles.login}>
        <Header />
        <Context.Provider value={{ state, setState }}>
          <form className={Styles.form}>
              <h2>Login</h2>

              <Input type='email' name='email' placeholder='Digite seu e-mail'/>
              <Input type='password' name='password' placeholder='Digite sua senha'/>
              <button data-testid='submitButton' type='submit'
              onClick={handleSubmit}
              disabled={!!state.emailError || !!state.passwordError }
              >Entrar</button>

              <span className={Styles.link}>Criar conta</span>
              <FormStatus />

          </form>
        </Context.Provider>
        <Footer />
    </div>
  )
}

export default Login

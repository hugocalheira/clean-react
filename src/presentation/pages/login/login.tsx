import React, { useEffect, useState } from 'react'
import { Header, Input, Footer, FormStatus } from '@/presentation/components'
import Styles from './login-styles.scss'
import Context from '@/presentation/contexts/form/form-context'
import { Validation } from '@/presentation/protocols/validation'
import { Authentication } from '@/domain/usecases'

type Props = {
  validation: Validation
  authentication: Authentication
}

const Login: React.FC<Props> = ({ validation, authentication }: Props) => {
  const [state, setState] = useState({
    isLoading: false,
    email: '',
    password: '',
    emailError: '',
    passwordError: '',
    mainError: ''
  })

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

  async function handleSubmit (event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    try {
      const { email, password, isLoading, emailError, passwordError } = state
      if (isLoading || emailError || passwordError) {
        return
      }
      setState({ ...state, isLoading: true })
      await authentication.auth({ email, password })
    } catch (err) {
      setState({
        ...state,
        isLoading: false,
        mainError: err.message
      })
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>', err)
    }
  }

  return (
    <div className={Styles.login}>
        <Header />
        <Context.Provider value={{ state, setState }}>
          <form data-testid="form" className={Styles.form} onSubmit={handleSubmit}>
              <h2>Login</h2>

              <Input type='email' name='email' placeholder='Digite seu e-mail'/>
              <Input type='password' name='password' placeholder='Digite sua senha'/>
              <button data-testid='submitButton' type='submit'
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

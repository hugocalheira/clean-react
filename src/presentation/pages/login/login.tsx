import React, { useEffect, useState } from 'react'
import { Header, Input, Footer, FormStatus } from '@/presentation/components'
import Styles from './login-styles.scss'
import Context from '@/presentation/contexts/form/form-context'
import { Validation } from '@/presentation/protocols/validation'
import { Authentication, SaveAccessToken } from '@/domain/usecases'
import { useNavigate } from 'react-router-dom'
import { act } from 'react-dom/test-utils'

type Props = {
  validation: Validation
  authentication: Authentication
  saveAccessToken: SaveAccessToken
}

const Login: React.FC<Props> = ({ validation, authentication, saveAccessToken }: Props) => {
  const [state, setState] = useState({
    isLoading: false,
    email: '',
    password: '',
    emailError: '',
    passwordError: '',
    mainError: ''
  })

  const navigate = useNavigate()

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
    const { email, password, isLoading, emailError, passwordError } = state
    if (isLoading || emailError || passwordError) {
      return
    }

    setState({ ...state, isLoading: true })
    await authentication.auth({ email, password })
      .then(async account => {
        await saveAccessToken.save(account.accessToken)
        navigate('/', { replace: true })
      }).catch(err => {
        act(() =>
          setState({
            ...state,
            isLoading: false,
            mainError: err.message
          })
        )
      })
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
              <span onClick={() => navigate('/signup')} data-testid='signup' className={Styles.link}>Criar conta</span>
              <FormStatus />
          </form>
        </Context.Provider>
        <Footer />
    </div>
  )
}

export default Login

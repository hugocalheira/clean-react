import React, { useContext, useEffect, useState } from 'react'
import { LoginHeader, Input, Footer, FormStatus, SubmitButton } from '@/presentation/components'
import Styles from './login-styles.scss'
import { Validation } from '@/presentation/protocols/validation'
import { Authentication } from '@/domain/usecases'
import { useNavigate } from 'react-router-dom'
import { FormContext, ApiContext } from '@/presentation/contexts'

type Props = {
  validation: Validation
  authentication: Authentication
}

const Login: React.FC<Props> = ({ validation, authentication }: Props) => {
  const { setCurrentAccount } = useContext(ApiContext)
  const [state, setState] = useState({
    isLoading: false,
    isFormInvalid: true,
    email: '',
    password: '',
    emailError: '',
    passwordError: '',
    mainError: ''
  })

  const navigate = useNavigate()

  const validate = (field: string): void => {
    setState(old => ({ ...old, [`${field}Error`]: validation.validate(field, state) }))
    setState(old => ({ ...old, isFormInvalid: !!old.emailError || !!old.passwordError }))
  }

  useEffect(() => validate('email'), [state.email])
  useEffect(() => validate('password'), [state.password])

  async function handleSubmit (event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    const { email, password, isLoading, isFormInvalid } = state
    if (isLoading || isFormInvalid) {
      return
    }

    setState({ ...state, isLoading: true })

    try {
      const account = await authentication.auth({ email, password })
      setCurrentAccount(account)
      navigate('/', { replace: true })
    } catch (err) {
      setState({
        ...state,
        isLoading: false,
        mainError: err.message
      })
    }
  }

  return (
    <div className={Styles.loginWrap}>
        <LoginHeader />
        <FormContext.Provider value={{ state, setState }}>
          <form data-testid="form" className={Styles.form} onSubmit={handleSubmit}>
              <h2>Login</h2>
              <Input type='email' name='email' placeholder='Digite seu e-mail'/>
              <Input type='password' name='password' placeholder='Digite sua senha'/>
              <SubmitButton text="Entrar" />
              <span onClick={() => navigate('/signup')} data-testid='signup-link' className={Styles.link}>Criar conta</span>
              <FormStatus />
          </form>
        </FormContext.Provider>
        <Footer />
    </div>
  )
}

export default Login

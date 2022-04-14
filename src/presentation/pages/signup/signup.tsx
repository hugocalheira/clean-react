import React, { useEffect, useState } from 'react'
import { Header, Input, Footer, FormStatus, SubmitButton } from '@/presentation/components'
import Styles from './signup-styles.scss'
import Context from '@/presentation/contexts/form/form-context'
import { useNavigate } from 'react-router-dom'
import { Validation } from '@/presentation/protocols/validation'
import { AddAccount, SaveAccessToken } from '@/domain/usecases'

type Props = {
  validation: Validation
  addAccount: AddAccount
  saveAccessToken: SaveAccessToken
}

const SignUp: React.FC<Props> = ({ validation, addAccount, saveAccessToken }: Props) => {
  const [state, setState] = useState({
    isLoading: false,
    isFormInvalid: true,
    name: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    nameError: '',
    emailError: '',
    passwordError: '',
    passwordConfirmationError: '',
    mainError: ''
  })

  const navigate = useNavigate()

  useEffect(() => {
    const nameError = validation.validate('name', state.name)
    const emailError = validation.validate('email', state.email)
    const passwordError = validation.validate('password', state.password)
    const passwordConfirmationError = validation.validate('passwordConfirmation', state.passwordConfirmation)

    setState(oldState => ({
      ...oldState,
      nameError,
      emailError,
      passwordError,
      passwordConfirmationError,
      isFormInvalid: !!nameError || !!emailError || !!passwordError || !!passwordConfirmationError
    }))
  }, [state.name, state.email, state.password, state.passwordConfirmation])

  async function handleSubmit (event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()

    const { name, email, password, passwordConfirmation, isLoading, isFormInvalid } = state

    if (isLoading || isFormInvalid) {
      return
    }

    setState({ ...state, isLoading: true })

    try {
      const account = await addAccount.add({ name, email, password, passwordConfirmation })
      await saveAccessToken.save(account.accessToken)
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
    <div className={Styles.signup}>
        <Header />
        <Context.Provider value={{ state, setState }}>
          <form data-testid='form' className={Styles.form} onSubmit={handleSubmit}>
              <h2>Criar conta</h2>
              <Input type='text' name='name' placeholder='Digite seu nome'/>
              <Input type='email' name='email' placeholder='Digite seu e-mail'/>
              <Input type='password' name='password' placeholder='Digite sua senha'/>
              <Input type='password' name='passwordConfirmation' placeholder='Confirme sua senha'/>
              <SubmitButton text='Cadastrar'/>
              <span data-testid='login-link' onClick={() => navigate('/login')} className={Styles.link}>Voltar para Login</span>
              <FormStatus />
          </form>
        </Context.Provider>
        <Footer />
    </div>
  )
}

export default SignUp

import React, { useContext, useEffect, useState } from 'react'
import { LoginHeader, Input, Footer, FormStatus, SubmitButton } from '@/presentation/components'
import Styles from './signup-styles.scss'
import { useNavigate } from 'react-router-dom'
import { Validation } from '@/presentation/protocols/validation'
import { AddAccount } from '@/domain/usecases'
import { FormContext, ApiContext } from '@/presentation/contexts'

type Props = {
  validation: Validation
  addAccount: AddAccount
}

const SignUp: React.FC<Props> = ({ validation, addAccount }: Props) => {
  const { setCurrentAccount } = useContext(ApiContext)
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

  const validate = (field: string): void => {
    setState(old => ({ ...old, [`${field}Error`]: validation.validate(field, state) }))
    setState(old => ({
      ...old,
      isFormInvalid: !!old.nameError || !!old.emailError || !!old.passwordError || !!old.passwordConfirmationError
    }))
  }

  useEffect(() => validate('name'), [state.name])
  useEffect(() => validate('email'), [state.email])
  useEffect(() => validate('password'), [state.password])
  useEffect(() => validate('passwordConfirmation'), [state.passwordConfirmation])

  async function handleSubmit (event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()

    const { name, email, password, passwordConfirmation, isLoading, isFormInvalid } = state

    if (isLoading || isFormInvalid) {
      return
    }

    setState({ ...state, isLoading: true })

    try {
      const account = await addAccount.add({ name, email, password, passwordConfirmation })
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
    <div className={Styles.signupWrap}>
        <LoginHeader />
        <FormContext.Provider value={{ state, setState }}>
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
        </FormContext.Provider>
        <Footer />
    </div>
  )
}

export default SignUp

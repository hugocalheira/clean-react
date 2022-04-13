import React, { useEffect, useState } from 'react'
import { Header, Input, Footer, FormStatus } from '@/presentation/components'
import Styles from './signup-styles.scss'
import Context from '@/presentation/contexts/form/form-context'
import { useNavigate } from 'react-router-dom'
import { Validation } from '@/presentation/protocols/validation'

type Props = {
  validation: Validation
}

const SignUp: React.FC<Props> = ({ validation }: Props) => {
  const [state, setState] = useState({
    isLoading: false,
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
    setState(oldState => ({
      ...oldState,
      nameError: validation.validate('name', oldState.name),
      emailError: validation.validate('email', oldState.email),
      passwordError: validation.validate('password', oldState.password),
      passwordConfirmationError: validation.validate('passwordConfirmation', oldState.passwordConfirmation)
    }))
  }, [state.name, state.email, state.password, state.passwordConfirmation])

  return (
    <div className={Styles.signup}>
        <Header />
        <Context.Provider value={{ state, setState }}>
          <form className={Styles.form} >
              <h2>Criar conta</h2>
              <Input type='text' name='name' placeholder='Digite seu nome'/>
              <Input type='email' name='email' placeholder='Digite seu e-mail'/>
              <Input type='password' name='password' placeholder='Digite sua senha'/>
              <Input type='password' name='passwordConfirmation' placeholder='Confirme sua senha'/>
              <button type='submit' disabled>Entrar</button>
              <span onClick={() => navigate('/login')} className={Styles.link}>Voltar para Login</span>
              <FormStatus />
          </form>
        </Context.Provider>
        <Footer />
    </div>
  )
}

export default SignUp

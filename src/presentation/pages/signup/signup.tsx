import React from 'react'
import { Header, Input, Footer, FormStatus } from '@/presentation/components'
import Styles from './signup-styles.scss'
import Context from '@/presentation/contexts/form/form-context'
import { useNavigate } from 'react-router-dom'

const SignUp: React.FC = () => {
  const navigate = useNavigate()
  return (
    <div className={Styles.signup}>
        <Header />
        <Context.Provider value={{ state: {} }}>
          <form className={Styles.form} >
              <h2>Criar conta</h2>
              <Input type='text' name='name' placeholder='Digite seu nome'/>
              <Input type='email' name='email' placeholder='Digite seu e-mail'/>
              <Input type='password' name='password' placeholder='Digite sua senha'/>
              <Input type='password' name='passwordConfirmation' placeholder='Confirme sua senha'/>
              <button type='submit'>Entrar</button>
              <span onClick={() => navigate('/login')} className={Styles.link}>Voltar para Login</span>
              <FormStatus />
          </form>
        </Context.Provider>
        <Footer />
    </div>
  )
}

export default SignUp

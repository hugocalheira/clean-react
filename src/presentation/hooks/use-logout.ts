import { useContext } from 'react'
import { ApiContext } from '@/presentation/contexts'
import { useNavigate } from 'react-router-dom'

type ResultType = () => void

export const useLogout = (): ResultType => {
  const { setCurrentAccount } = useContext(ApiContext)
  const navigate = useNavigate()
  return (): void => {
    setCurrentAccount(null)
    navigate('/login', { replace: true })
  }
}

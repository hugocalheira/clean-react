import { AccessDeniedError } from '@/domain/errors'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { ApiContext } from '../contexts'

type CallbackType = (error: Error) => void

export const useErrorHandler = (callback: CallbackType): CallbackType => {
  const { setCurrentAccount } = useContext(ApiContext)
  const navigate = useNavigate()
  return (error: Error): void => {
    callback(error)
    if (error instanceof AccessDeniedError) {
      setCurrentAccount(null)
      navigate('/login', { replace: true })
    }
  }
}

import { AccessDeniedError } from '@/domain/errors'
import { useLogout } from './use-logout'

type CallbackType = (error: Error) => void

export const useErrorHandler = (callback: CallbackType): CallbackType => {
  const handleLogout = useLogout()
  return (error: Error): void => {
    callback(error)
    if (error instanceof AccessDeniedError) {
      handleLogout()
    }
  }
}

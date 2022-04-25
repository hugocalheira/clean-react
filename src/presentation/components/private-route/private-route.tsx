import { ApiContext } from '@/presentation/contexts'
import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

type PrivateProps = {
  component: React.FC
}
// const PrivateRoute: React.FC<RouteProps> = (props: RouteProps) => {
const PrivateRoute: React.FC<PrivateProps> = ({ component: Component }: PrivateProps) => {
  const navigate = useNavigate()
  const { getCurrentAccount } = useContext(ApiContext)
  const accessToken = getCurrentAccount()?.accessToken

  useEffect(() => {
    !accessToken && navigate('/login', { replace: true })
  },[])

  return accessToken ? <Component /> : <></>
}

export default PrivateRoute

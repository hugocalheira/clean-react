import React from 'react'
import { useNavigate, RouteProps } from 'react-router-dom'

const privatRoute: React.FC<RouteProps> = (props: RouteProps) => {
  const navigate = useNavigate()
  navigate('/login', { replace: true })
  return null
}

export default privatRoute

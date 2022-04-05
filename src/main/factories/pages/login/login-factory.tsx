import React from 'react'
import { Login } from '@/presentation/pages'
import { RemoteAuthentication } from '@/data/usecases/authentication/remote-authentication'
import { ValidationComposite } from '@/validation/validators'
import { ValidationBuilder } from '@/validation/validators/builder/validation-builder'
import { makeAxiosHttpClient } from '../../http/axios-http-client-factory'

export const makeLogin: React.FC = () => {
  const url = 'http://fordevs.herokuapp.com/api/login'
  const remoteAuthentication = new RemoteAuthentication(url, makeAxiosHttpClient())

  const validationComposite = ValidationComposite.build([
    ...ValidationBuilder.field('email').required().email().build(),
    ...ValidationBuilder.field('password').required().min(5).build()
  ])

  return (
        <Login
            authentication={remoteAuthentication}
            validation={validationComposite}
        />
  )
}

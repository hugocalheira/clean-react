import React from 'react'
import ReactDOM from 'react-dom'
import Router from '@/presentation/components/router/router'
import { makeLogin } from '@/main/factories/pages/login/login-factory'
import { makeSignUp } from '@/main/factories/pages/signup/signup-factory'
import '@/presentation/styles/globals.scss'

ReactDOM.render(
    <Router makeLogin={makeLogin} makeSignUp={makeSignUp} />,
    document.getElementById('main')
)

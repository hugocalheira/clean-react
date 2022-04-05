import React from 'react'
import ReactDOM from 'react-dom'
import Router from '@/presentation/components/router/router'
import { makeLogin } from '@/main/factories/pages/login/login-factory'
import '@/presentation/styles/globals.scss'

ReactDOM.render(
    <Router MakeLogin={makeLogin} />,
    document.getElementById('main')
)

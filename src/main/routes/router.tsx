import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import {
  makeLogin as MakeLogin,
  makeSignUp as MakeSignUp,
  makeSurveyList as MakeSurveyList
} from '@/main/factories/pages'
import { getCurrentAccountAdapter, setCurrentAccountAdapter } from '@/main/adapters/current-account-adapter'
import { ApiContext } from '@/presentation/contexts'
import { PrivateRoute } from '@/presentation/components'

const Router: React.FC = () => {
  return (
    <ApiContext.Provider value={{
      setCurrentAccount: setCurrentAccountAdapter,
      getCurrentAccount: getCurrentAccountAdapter
    }}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<MakeLogin />} />
          <Route path="/signup" element={<MakeSignUp />} />
          <Route path="/" element={<PrivateRoute component={MakeSurveyList} />} />
        </Routes>
      </BrowserRouter>
    </ApiContext.Provider>
  )
}

export default Router

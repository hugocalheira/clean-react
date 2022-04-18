import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

type Factory = {
  makeLogin: React.FC
  makeSignUp: React.FC
}

const Router: React.FC<Factory> = (Factory: Factory) => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Factory.makeLogin />} />
        <Route path="/signup" element={<Factory.makeSignUp />} />
      </Routes>
    </BrowserRouter>
  )
}

export default Router

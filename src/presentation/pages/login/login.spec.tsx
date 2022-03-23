import React from 'react'
import {
  render
  // queryByAttribute
} from '@testing-library/react'
import { Login } from '@/presentation/pages'

describe('Login Component', () => {
  test('Should not render spinner and error on start', () => {
    // const getById = queryByAttribute.bind(null, 'id')
    // const dom = render(<Login />)
    // const spinner = getById(dom.container, 'spinner')
    // expect(spinner).toBe(null)

    const { getByTestId } = render(<Login />)
    const errorWrap = getByTestId('errorWrap') || null
    expect(errorWrap.childElementCount).toBe(0)
  })
})

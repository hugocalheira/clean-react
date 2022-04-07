import React from 'react'
import { fireEvent, render, RenderResult } from '@testing-library/react'
import faker from '@faker-js/faker'
import Input from './input'
import Context from '@/presentation/contexts/form/form-context'

const makeSut = ({ fieldName }: {fieldName: string}): RenderResult => {
  return render(
    <Context.Provider value={{ state: {} }}>
      <Input name={fieldName}/>
    </Context.Provider>
  )
}

describe('Input Component', () => {
  test('Should begin with readOnly property', () => {
    const fieldName = faker.random.word()
    const sut = makeSut({ fieldName })
    const input = sut.getByTestId(fieldName) as HTMLInputElement
    expect(input.readOnly).toBe(true)
  })

  test('Should remove readOnly property on focus', () => {
    const fieldName = faker.random.word()
    const sut = makeSut({ fieldName })
    const input = sut.getByTestId(fieldName) as HTMLInputElement
    fireEvent.focus(input)
    expect(input.readOnly).toBe(false)
  })
})

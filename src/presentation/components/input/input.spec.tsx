import React from 'react'
import { render } from '@testing-library/react'
import Input from './input'
import Context from '@/presentation/contexts/form/form-context'

describe('Input Component', ()=>{
    test('Should begin with readOnly property', () => {
        const { getByTestId } = render(
            <Context.Provider value={{state:{}}}>
                <Input name='any_field'/>
            </Context.Provider>
        )
        const input = getByTestId('any_field') as HTMLInputElement
        expect(input.readOnly).toBe(true)
    })
})
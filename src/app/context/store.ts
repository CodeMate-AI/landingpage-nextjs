'use client'
import {configureStore} from '@reduxjs/toolkit'
import { todoReducer } from './reducers/todoSlice'


export const store = configureStore({
    reducer:{
        todo:todoReducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
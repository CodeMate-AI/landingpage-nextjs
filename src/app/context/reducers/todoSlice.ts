'use client'
import { createSlice,PayloadAction } from "@reduxjs/toolkit";

interface TodoState{
    todos:string[];
}

const initialState:TodoState= {
    todos:[],
};

const todoSlice = createSlice({
    name:"todos",
    initialState,
    reducers:{
        add:(state,action:PayloadAction<string>)=>{
            state.todos.push(action.payload)
        },
        remove:(state,action:PayloadAction<number>)=>{
           state.todos = state.todos.filter((_,idx)=> idx !== action.payload)
        }
    }
});

export const {add,remove} = todoSlice.actions 
export const todoReducer =  todoSlice.reducer


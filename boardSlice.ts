import { createSlice } from "@reduxjs/toolkit";
import {type BoardState } from "./types";
import {type PayloadAction } from "@reduxjs/toolkit";
import {type Card } from "./types";
import { type BoardColumn } from "./types";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchBoard = createAsyncThunk('board/fetchBoard',async () =>{
    const [columnsResponse,cardsResponse] = await Promise.all([
        fetch('http://localhost:3001/columns'),
        fetch('http://localhost:3001/cards')
    ])
    if(!columnsResponse.ok || !cardsResponse.ok){
        throw new Error('Не удалось загрузить данные')
    }
    const columns:BoardColumn[] = await columnsResponse.json()
    const cards:Card[] = await cardsResponse.json()
    return {columns,cards}
})

const initialState:BoardState = {
    cards:[],
    status:'idle',
    error:null,
    columns:[]
}

const board = createSlice({
    name:'board',
    initialState,
    reducers:{
        addCard(state,action:PayloadAction<Card>){
            state.cards.push(action.payload)
        },
        addColumn(state,action:PayloadAction<BoardColumn>){
            state.columns.push(action.payload)
        },
        deleteColumn(state,action:PayloadAction<string>){
            state.columns = state.columns.filter((col)=>col.id !== action.payload)
            state.cards = state.cards.filter((card)=>card.column !== action.payload)
        },
        moveCard(state,action:PayloadAction<{id:string,column:string}>){
            const card = state.cards.find(card=>card.id === action.payload.id)
            if(card){
                card.column = action.payload.column
            }
        },
        deleteCard(state,action:PayloadAction<string>){
            state.cards = state.cards.filter((card)=>card.id !== action.payload)
        },
        updateCard(state,action:PayloadAction<Card>){
            const cardIndex = state.cards.findIndex((card)=>card.id === action.payload.id)
            if(cardIndex !== -1){
                state.cards[cardIndex] = action.payload
            }
        }
    },
    extraReducers:(builder) =>{
        builder
            .addCase(fetchBoard.pending, (state)=>{
                state.status = 'loading'
                state.error = null
            })
            .addCase(fetchBoard.fulfilled, (state,action)=>{
                state.status = 'succeeded'
                state.cards = action.payload.cards
                state.columns = action.payload.columns
            })
            .addCase(fetchBoard.rejected,(state,action)=>{
                state.status = 'failed'
                state.error = action.error.message ?? 'Ошибка'
            })
    }
})
export const {addCard,addColumn,moveCard,deleteCard,deleteColumn,updateCard} = board.actions
export default board.reducer
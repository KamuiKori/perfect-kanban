import { createSlice, isRejected } from "@reduxjs/toolkit";
import {type BoardState } from "./types";
import {type PayloadAction } from "@reduxjs/toolkit";
import {type Card } from "./types";
import { type BoardColumn, type Board } from "./types";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchBoard = createAsyncThunk('board/fetchBoard',async (boardId:string) =>{
    const [columnsResponse,cardsResponse] = await Promise.all([
        fetch(`http://localhost:3001/columns?boardId=${boardId}`),
        fetch(`http://localhost:3001/cards?boardId=${boardId}`)
    ])
    if(!columnsResponse.ok || !cardsResponse.ok){
        throw new Error('Не удалось загрузить данные')
    }
    const columns:BoardColumn[] = await columnsResponse.json()
    const cards:Card[] = await cardsResponse.json()
    return {columns,cards}
})
export const fetchBoards = createAsyncThunk('board/fetchBoards', async()=>{
    const response = await fetch('http://localhost:3001/boards')
    if(!response.ok){
        throw new Error('Не удалось загрузить данные')
    }
    const boards:Board[] = await response.json()
    return boards
})

export const createBoard = createAsyncThunk('board/createBoard', async(board:Board)=>{
    const response = await fetch('http://localhost:3001/boards',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(board)
    })
    if(!response.ok){
        throw new Error('Не удалось создать доску')
    }
    const newBoard:Board = await response.json()
    return newBoard
})

export const createCard = createAsyncThunk('board/createCard',async(card:Card)=>{
    const response = await fetch('http://localhost:3001/cards',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(card)
    })
    if(!response.ok){
        throw new Error('Не удалось создать задачу')
    }
    const newCard:Card = await response.json()
    return newCard
})

export const createColumn = createAsyncThunk('board/createColumn',async(column:BoardColumn)=>{
    const response = await fetch('http://localhost:3001/columns',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(column)
    })
    if(!response.ok){
        throw new Error('Не удалось добавить колонку')
    }
    const newColumn:BoardColumn = await response.json()
    return newColumn
})
export const deleteCard = createAsyncThunk('board/removeCard',async(cardID:string)=>{
    const response = await fetch(`http://localhost:3001/cards/${cardID}`,{
        method:'DELETE',
    })
    if(!response.ok){
        throw new Error('Не удалось удалить задачу')
    }
    return cardID
})

export const patchCard = createAsyncThunk('board/patchCard',async({ id, changes }: { id: string, changes: Partial<Card> })=>{
    const response = await fetch(`http://localhost:3001/cards/${id}`,{
        method:'PATCH',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(changes)
    })
    if(!response.ok){
        throw new Error('Не удалось изменить параметр задачи')
    }
    const newCard:Card = await response.json()
    return newCard
})

export const deleteColumn = createAsyncThunk('board/deleteColumn',async(columnId:string)=>{
    const cardsResponse = await  fetch(`http://localhost:3001/cards?column=${columnId}`,{
        method:'GET'
    })
    if(!cardsResponse.ok){
        throw new Error('Не удалось получить задачи')
    }
    const cards:Card[] = await cardsResponse.json()
    await Promise.all(cards.map((card)=>{
        return fetch(`http://localhost:3001/cards/${card.id}`,{
            method:'DELETE'
        })
    }))
    const colResponse = await fetch(`http://localhost:3001/columns/${columnId}`,{
        method:'DELETE'
    })
    if(!colResponse.ok){
        throw new Error('Не удалось удалить колонку')
    }
    return columnId
})
export const patchColumn = createAsyncThunk('board/patchColumn', async({ id, changes }: { id: string, changes: Partial<BoardColumn> })=>{
    const patchResponse = await fetch(`http://localhost:3001/columns/${id}`,{
        method:'PATCH',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(changes)
    })
    if(!patchResponse.ok){
        throw new Error('Не удалось изменить колонку')
    }
    const newColumn:BoardColumn = await patchResponse.json();
    return newColumn
})
export const deleteBoard = createAsyncThunk('board/deleteBoard',async(boardId:string)=>{
    const [columnsResponse,cardsResponse] = await Promise.all([
        fetch(`http://localhost:3001/columns?boardId=${boardId}`),
        fetch(`http://localhost:3001/cards?boardId=${boardId}`)
    ])
    if(!columnsResponse.ok){
        throw new Error('Не удалось получить колонки')
    }
    if(!cardsResponse.ok){
        throw new Error('Не удалось получить задачи')
    }
    const cards = await cardsResponse.json()
    const columns = await columnsResponse.json()
    await Promise.all([
        ...cards.map((card:Card)=>{
            return fetch(`http://localhost:3001/cards/${card.id}`,{
                method:'DELETE'
            })
        }),
        ...columns.map((col:BoardColumn)=>{
            return fetch(`http://localhost:3001/columns/${col.id}`,{
                method:'DELETE'
            })
        })
    ])
    const deleteBoardResponse = await fetch(`http://localhost:3001/boards/${boardId}`,{
            method:'DELETE'
    })
    if(!deleteBoardResponse.ok){
        throw new Error('Не удалось удалить доску')
    }
    return boardId
})

const initialState:BoardState = {
    cards:[],
    status:'idle',
    error:null,
    columns:[],
    boards:[],
    actionError:null
}

const board = createSlice({
    name:'board',
    initialState,
    reducers:{
        cleanActionError(state){
            state.actionError = null
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
            .addCase(fetchBoards.fulfilled, (state,action)=>{
                state.boards = action.payload
            })
            .addCase(createBoard.fulfilled,(state,action)=>{
                state.boards.push(action.payload)
            })
            .addCase(createColumn.fulfilled,(state,action)=>{
                state.columns.push(action.payload)
            })
            .addCase(createCard.fulfilled,(state,action)=>{
                state.cards.push(action.payload)
            })
            .addCase(deleteCard.fulfilled,(state,action)=>{
                state.cards = state.cards.filter((card)=>card.id !== action.payload)
            })
            .addCase(patchCard.fulfilled,(state,action)=>{
                const cardIndex = state.cards.findIndex((card)=>card.id === action.payload.id)
                if(cardIndex !== -1){
                    state.cards[cardIndex] = action.payload
                }
            })
            .addCase(deleteColumn.fulfilled,(state,action)=>{
                state.columns = state.columns.filter((col)=>col.id !== action.payload)
                state.cards = state.cards.filter((card)=>card.column !== action.payload)
            })
            .addCase(deleteBoard.fulfilled,(state,action)=>{
                state.boards = state.boards.filter((board)=>board.id !== action.payload)
            })
            .addCase(patchColumn.fulfilled,(state,action)=>{
                const colIndex = state.columns.findIndex((col)=>col.id === action.payload.id)
                if(colIndex !== -1){
                    state.columns[colIndex] = action.payload
                }
            })
            .addMatcher(isRejected,(state,action)=>{
                state.actionError = action.error.message ?? 'Неизвестная ошибка'
            })
    }
})
export const {cleanActionError} = board.actions
export default board.reducer
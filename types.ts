export type BoardColumn = {id:string,title:string,boardId:string}
export type Priority = 'low'|'medium'|'high'
export type Card = {column:string,id:string,title:string,priority:Priority,createdAt:string,description?:string,dueDate?:string,boardId:string}
export type LoadStatus = 'idle'|'loading'|'succeeded'|'failed'
export type BoardState = {cards:Card[],status:LoadStatus,error:string|null,columns:BoardColumn[],boards:Board[]}
export type Board = {id:string,name:string}
import { useDispatch, useSelector } from 'react-redux'
import styles from './BoardSwitcher.module.css'
import {type RootState, type AppDispatch } from '../../../store'
import { useEffect } from 'react'
import { deleteBoard, fetchBoards } from '../../../boardSlice'
import { NavLink, useNavigate } from 'react-router-dom'
import type { Board } from '../../../types'
import AddBoard from '../AddBoard/AddBoard'

function BoardSwitcher(){
    const boards = useSelector((state:RootState)=> state.board.boards)
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate();

    useEffect(()=>{
        dispatch(fetchBoards())
    },[dispatch])

    async function deleteBoardHandler(board:Board){
        if(window.confirm(`Удалить доску ${board.name}?`)){
            await dispatch(deleteBoard(board.id))
            navigate(`/`)
        }
    }

    return(
        <div className={styles.switcherWrapper}>
            {
                boards.map((board:Board)=>{
                    return (
                        <div className={styles.boardRow} key={board.id}>
                            <NavLink className={({isActive})=>isActive?`${styles.link} ${styles.active}`:`${styles.link}`} to={`/boards/${board.id}`}>{board.name}</NavLink>
                            <button className={styles.deleteBoardButton} aria-label="Удалить доску" onClick={()=>deleteBoardHandler(board)}></button>
                        </div>
                    )
                })
            }
            <AddBoard/>
        </div>
    )
}
export default BoardSwitcher
import { useDispatch, useSelector } from 'react-redux'
import { type AppDispatch, type RootState } from '../store'
import Column from './Components/Column/Column'
import { useEffect } from 'react'
import { fetchBoard } from '../boardSlice'
import styles from './App.module.css'
import AddColumn from './Components/AddColumn/AddColumn'
import { useParams } from 'react-router-dom'

function BoardPage(){
    const columns = useSelector((state:RootState)=>state.board.columns)
    const status = useSelector((state:RootState)=>state.board.status)
    const error = useSelector((state:RootState)=>state.board.error)
    const {boardId} = useParams()

    const dispatch = useDispatch<AppDispatch>()
    useEffect(()=>{
        if(boardId){
            dispatch(fetchBoard(boardId))
        }
    },[dispatch,boardId])

    return (
        <div>
        <p className={styles.boardName}>Доска:{boardId}</p>
        {
            (status === 'idle' || status === 'loading') && <p className={styles.message}>Загрузка...</p>
        }
        {
            status === 'failed' &&  <p className={styles.error}>Ошибка:{error}</p>
        }
        <div className={styles.board}>
        { status === 'succeeded' &&
        (
            <>
            {
            columns.map((column)=>{
                return <Column key={column.id} id={column.id} title={column.title}/>
            })
            }
            <AddColumn/>
            </>
        )
        }
        </div>
        </div>
    )
}
export default BoardPage
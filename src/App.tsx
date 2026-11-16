import { useDispatch, useSelector } from 'react-redux'
import { type AppDispatch, type RootState } from '../store'
import Column from './Components/Column/Column'
import { useEffect } from 'react'
import { fetchBoard } from '../boardSlice'
import styles from './App.module.css'
import AddColumn from './Components/AddColumn/AddColumn'

function App() {
  const columns = useSelector((state:RootState)=>state.board.columns)
  const status = useSelector((state:RootState)=>state.board.status)
  const error = useSelector((state:RootState)=>state.board.error)

  const dispatch = useDispatch<AppDispatch>()
  useEffect(()=>{
    dispatch(fetchBoard())
  },[dispatch])

  return (
    <div>
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

export default App

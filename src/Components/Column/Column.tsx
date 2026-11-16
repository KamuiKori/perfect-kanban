import { useDispatch, useSelector } from "react-redux"
import { type RootState } from "../../../store"
import CardItem from "../CardItem/CardItem"
import styles from './Column.module.css'
import { useState } from "react"
import AddTaskModal from '../AddTaskModal/AddTaskModal'
import { deleteColumn } from "../../../boardSlice"

type ColumnProps = {
    id:string,
    title:string,
}
function Column({id,title}:ColumnProps){
    const [isModalOpen,setIsModalOpen] = useState(false)
    const cards = useSelector((state:RootState)=> state.board.cards)
    const dispatch = useDispatch()
    const filtredCards = cards.filter((card)=>{
        return card.column === id
    })
    function openModalHandler(){
        setIsModalOpen(true)
    }
    function closeModalHandler(){
        setIsModalOpen(false)
    }
    function deleteColumnHandler(){
        if(window.confirm('Удалить столбец?')){
            dispatch(deleteColumn(id))
        }
    }
    return(
        <div className={styles.column}>
            <button className={styles.deleteButton} aria-label="Удалить колонку" onClick={deleteColumnHandler}></button>
            <h3 className={styles.title}>{title}</h3>
            <div className={styles.addWrapper}>
                <button className={styles.addButton} aria-label="Add task" onClick={openModalHandler}>Добавить задачу</button>
            </div>
            <div className={styles.cards}>
                {
                    filtredCards.map((card)=>{
                        return <CardItem key={card.id} card={card}/>
                    })
                }
            </div>
            {isModalOpen && <AddTaskModal columnId={id} onClose={closeModalHandler}/>}
        </div>
    )
}
export default Column
import { useDispatch, useSelector } from "react-redux"
import { type RootState } from "../../../store"
import CardItem from "../CardItem/CardItem"
import styles from './Column.module.css'
import { useState } from "react"
import AddTaskModal from '../AddTaskModal/AddTaskModal'
import { deleteColumn, patchColumn } from "../../../boardSlice"
import { type AppDispatch } from '../../../store'
import { type Priority } from '../../../types'

type ColumnProps = {
    id:string,
    title:string,
    searchValue:string,
    priorityFilter: Priority | 'all'
}
function Column({id,title,searchValue,priorityFilter}:ColumnProps){
    const [isModalOpen,setIsModalOpen] = useState(false)
    const [isEditing,setIsEditing] = useState(false)
    const [titleValue,setTitleValue] = useState(title)
    const cards = useSelector((state:RootState)=> state.board.cards)
    const dispatch = useDispatch<AppDispatch>()
    const filtredCards = cards.filter((card)=>{
        return card.column === id
            && card.title.toLowerCase().includes(searchValue.toLowerCase())
            && (priorityFilter === 'all' || card.priority === priorityFilter)
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
    function titleDoubleClickHandler(){
        setIsEditing(true)
    }
    function titleInputChangeHandler(e:React.ChangeEvent<HTMLInputElement>){
        setTitleValue(e.target.value)
    }
    function submitChangeNameColumnHandler(e:React.SubmitEvent<HTMLFormElement>){
        e.preventDefault();
        saveTitle()
        setIsEditing(false)
    }
    function onBlurHandler(){
        saveTitle()
        setIsEditing(false)
    }
    function saveTitle(){
        if(titleValue.trim().length !== 0 && titleValue.trim() !== title){
            dispatch(patchColumn({id:id,changes:{title:titleValue.trim()}}))
        }
        else{
            setTitleValue(title)
        }
    }
    return(
        <div className={styles.column}>
            {!isEditing && <button className={styles.deleteButton} aria-label="Удалить колонку" onClick={deleteColumnHandler}></button>}
            {!isEditing && <h3 className={styles.title} onDoubleClick={titleDoubleClickHandler}>{title}</h3>}
            {isEditing &&
                <form onSubmit={submitChangeNameColumnHandler} className={styles.titleForm}>
                    <input className={styles.titleInput} autoFocus type="text" value={titleValue} onChange={titleInputChangeHandler} onBlur={onBlurHandler}/>
                </form>
            }
            <div className={styles.addWrapper}>
                {!isEditing && <button className={styles.addButton} aria-label="Add task" onClick={openModalHandler}>Добавить задачу</button>}
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
import { useState } from "react"
import { type Card , type Priority } from "../../../types"
import styles from './CardItem.module.css'
import Modal from "../Modal/Modal"
import { useDispatch, useSelector } from "react-redux"
import { type RootState } from "../../../store"
import { deleteCard, moveCard, updateCard } from "../../../boardSlice"
import EditCardForm from "../EditCardForm/EditCardForm"

type CardProps = {
    card:Card
}
const priorityLabels: Record<Priority,string> = {
    'low':'Низкий',
    'medium':'Средний',
    'high':'Высокий',
}

function CardItem({card}:CardProps){
    const [isCardOpen,setIsCardOpen] = useState(false)
    const [isEditing,setIsEditing] = useState(false)
    const columns = useSelector((state:RootState)=>state.board.columns)
    const columnNumber = columns.findIndex((col)=>col.id === card.column)
    const column = columns[columnNumber]
    const prevColumn = columns[columnNumber-1]
    const nextColumn = columns[columnNumber+1]
    const dispatch = useDispatch();
    const dueTime = new Date(card.dueDate + 'T00:00:00').getTime()
    const todayStart = new Date().setHours(0, 0, 0, 0)
    const isOverdue = card.dueDate? dueTime< todayStart:false;

    function clickHandler(){
        setIsCardOpen(true)
    }
    function closeHandler(){
        setIsCardOpen(false)
    }
    function prevButtonClickHandler(e:React.MouseEvent<HTMLButtonElement>){
        e.stopPropagation()
        dispatch(moveCard({id:card.id,column:prevColumn.id}))
    }
    function nextButtonClickHandler(e:React.MouseEvent<HTMLButtonElement>){
        e.stopPropagation()
        dispatch(moveCard({id:card.id,column:nextColumn.id}))
    }
    function deleteBtnClickHandler(e:React.MouseEvent<HTMLButtonElement>){
        e.stopPropagation()
        if(window.confirm('Удалить карточку?')){
            dispatch(deleteCard(card.id))
            closeHandler()
        }
        return
    }
    function editingButtonClickHandler(){
        setIsEditing(true)
    }
    function onCancelHandler(){
        setIsEditing(false)
    }
    function onSaveHandler(card:Card){
        dispatch(updateCard(card))
        onCancelHandler()
    }
    return (
        <>
            <div className={styles.card} onClick={clickHandler}>
                <div className={styles.titleRow}>
                    <span className={`${styles.dot} ${styles[card.priority]}`} title={priorityLabels[card.priority]}></span>
                    <span>{card.title}</span>
                </div>
                <p className={`${styles.deadlineText} ${card.dueDate?isOverdue?styles.overdue:styles.normalDue:styles.empty}`}>{card.dueDate?new Date(card.dueDate + 'T00:00:00').toLocaleDateString('ru-RU'):'-'}</p>
                <div className={styles.moveButtons}>
                    {prevColumn && <button onClick={prevButtonClickHandler} className={styles.moveButton}>←</button>}
                    {nextColumn && <button onClick={nextButtonClickHandler} className={styles.moveButton}>→</button>}
                </div>
            </div>
            {isCardOpen && !isEditing && 
            <Modal title={card.title} onClose={closeHandler}>
                <div className={styles.cardInfoBlock}>
                    Дата создания:
                    <p>{new Date(card.createdAt).toLocaleDateString('ru-RU')}</p>
                </div>
                <div className={styles.cardInfoBlock}>
                    Статус:
                    <p>{column?.title ?? 'Неизвестно'}</p>
                </div>
                <div className={styles.cardInfoBlock}>
                    Описание:
                    {card.description ? <p>{card.description}</p> : <p className={styles.empty}>Нет описания</p>}
                </div>
                <div className={styles.cardInfoBlock}>
                    Приоритет:
                    <p>{priorityLabels[card.priority]}</p>
                </div>
                <div className={styles.cardInfoBlock}>
                    Дедлайн:
                    {card.dueDate? <p>{new Date(card.dueDate + 'T00:00:00').toLocaleDateString('ru-RU')}</p>:<p className={styles.empty}>Дедлайн не задан</p>}
                </div>
                <div className={styles.buttonsWrapper}>
                    <button className={styles.editButton} onClick={editingButtonClickHandler}>Редактировать</button>
                    <button onClick={deleteBtnClickHandler} className={styles.deleteButton}>Удалить</button>
                </div>
            </Modal>}
            {
                isEditing && <EditCardForm card={card} onCancel={onCancelHandler} onSave={onSaveHandler}/>
            }
        </>
    )
}
export default CardItem
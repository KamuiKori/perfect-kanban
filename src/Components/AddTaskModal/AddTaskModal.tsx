import { useDispatch } from 'react-redux'
import style from './AddTaskModal.module.css'
import {useState} from 'react'
import { addCard } from '../../../boardSlice'
import type { Card } from '../../../types'
import type { Priority } from '../../../types'
import Modal from '../Modal/Modal'

type PopupProps = {
    onClose:() => void,
    columnId:string
}
function AddTaskModal(props:PopupProps){
    const {onClose,columnId} = props
    const [inputValue,setInputValue] = useState('')
    const [textareaValue,setTextareaValue] = useState('')
    const [dueDateValue,setDueDateValue] = useState('')
    const [priority,setPriority] = useState<Priority | ''>('')
    const dispatch = useDispatch()

    function submitFormHandler(e:React.FormEvent<HTMLFormElement>){
        e.preventDefault()
        if(priority === ''){
            return
        }
        if(inputValue.trim().length > 0){
            const card:Card = {title:inputValue.trim(),id:crypto.randomUUID(),column:columnId,createdAt:new Date().toISOString(),priority:priority,description:textareaValue.trim() || undefined,dueDate:dueDateValue || undefined}
            dispatch(addCard(card))
            setInputValue('')
            onClose()
        }
    }
    function taskInputOnChangeHandler(e:React.ChangeEvent<HTMLInputElement>){
        setInputValue(e.target.value)
    }
    function textAreaOnChangeHandler(e:React.ChangeEvent<HTMLTextAreaElement>){
        setTextareaValue(e.target.value)
    }
    function dueDateOnChangeHandler(e:React.ChangeEvent<HTMLInputElement>){
        setDueDateValue(e.target.value)
    }
    function priorityOnChangeHandler(e:React.ChangeEvent<HTMLSelectElement>){
        setPriority(e.target.value as Priority)
    }
    return(
        <Modal title="Создание новой задачи" onClose={onClose}>
                <form onSubmit={submitFormHandler} className={style.form}>
                    <label className={style.label}>
                        Название
                        <input className={style.input} type="text" placeholder='Название новой задачи' value={inputValue} onChange={taskInputOnChangeHandler}/>
                    </label>
                    <label className={style.label}>
                        Описание
                        <textarea className={style.input} placeholder='Текст описания' onChange={textAreaOnChangeHandler} value={textareaValue}></textarea>
                    </label>
                    <label className={style.label}>
                        Дедлайн
                        <input className={`${style.input} ${dueDateValue === '' ? style.empty : ''}`} type="date" value={dueDateValue} onChange={dueDateOnChangeHandler}/>
                    </label>
                    <label className={style.label}>
                        Выберите приоритет
                        <select className={`${style.input} ${style.select}`} onChange={priorityOnChangeHandler} value={priority} required>
                            <option value="" disabled>Приоритет</option>
                            <option value="low">Низкий</option>
                            <option value="medium">Средний</option>
                            <option value="high">Высокий</option>
                        </select>
                    </label>
                    <button className={style.addButton}>Добавить</button>
                </form>
            </Modal>
    )
}
export default AddTaskModal
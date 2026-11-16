import { useState } from 'react'
import type { Card, Priority } from '../../../types'
import style from './EditCardForm.module.css'
import Modal from '../Modal/Modal'

type PopupProps = {
    card:Card,
    onCancel:()=>void,
    onSave:(card:Card)=>void
}

function EditCardForm(props:PopupProps){
    const [title,setTitle] = useState(props.card.title)
    const [description,setDescription] = useState(props.card.description??'')
    const [dueDate,setDueDate] = useState(props.card.dueDate??'')
    const [priority,setPriority] = useState(props.card.priority)

    function submitFormHandler(e:React.FormEvent<HTMLFormElement>){
        e.preventDefault()
        const updated: Card = {
            ...props.card,
            title: title.trim(),
            priority,
            description: description.trim() || undefined,
            dueDate: dueDate || undefined,
        }
        props.onSave(updated)
    }
    function taskInputOnChangeHandler(e:React.ChangeEvent<HTMLInputElement>){
        setTitle(e.target.value)
    }
    function textAreaOnChangeHandler(e:React.ChangeEvent<HTMLTextAreaElement>){
        setDescription(e.target.value)
    }
    function dueDateOnChangeHandler(e:React.ChangeEvent<HTMLInputElement>){
        setDueDate(e.target.value)
    }
    function priorityOnChangeHandler(e:React.ChangeEvent<HTMLSelectElement>){
        setPriority(e.target.value as Priority)
    }

    return(
        <Modal title="Редактирование задачи" onClose={props.onCancel}>
            <form onSubmit={submitFormHandler} className={style.form}>
                <label className={style.label}>
                    Название
                    <input className={style.input} type="text" placeholder='Название задачи' value={title} onChange={taskInputOnChangeHandler}/>
                </label>
                <label className={style.label}>
                    Описание
                    <textarea className={style.input} placeholder='Текст описания' onChange={textAreaOnChangeHandler} value={description}></textarea>
                </label>
                <label className={style.label}>
                    Дедлайн
                    <input className={`${style.input} ${dueDate === '' ? style.empty : ''}`} type="date" value={dueDate} onChange={dueDateOnChangeHandler}/>
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
                <button className={style.saveButton}>Сохранить</button>
            </form>
        </Modal>
    )
}
export default EditCardForm
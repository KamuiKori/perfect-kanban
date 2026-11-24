import { useState } from 'react'
import styles from './AddColumn.module.css'
import Modal from '../Modal/Modal'
import { useDispatch } from 'react-redux'
import { createColumn } from '../../../boardSlice'
import { useParams } from 'react-router-dom'
import { type AppDispatch } from '../../../store'

function AddColumn(){
    const [isModalOpen,setIsModalOpen] = useState(false)
    const [inputVal,setInputVal] = useState('')
    const dispatch = useDispatch<AppDispatch>()
    const {boardId} = useParams()

    function AddColumnHandler(){
        setIsModalOpen(true)
    }
    function closeHandler(){
        setIsModalOpen(false)
    }
    function inputOnChangeHandler(e:React.ChangeEvent<HTMLInputElement>){
        setInputVal(e.target.value)
    }
    function submitHandler(e:React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        if(inputVal.trim().length > 0 && boardId){
            dispatch(createColumn({id:crypto.randomUUID(),title:inputVal.trim(),boardId}))
            setInputVal('')
            setIsModalOpen(false)
        }
        return
    }
    return(
        <>
        <div className={styles.addNewColumnWrapper}>
            <button className={styles.addNewColumnButton} onClick={AddColumnHandler}>Добавить колонку</button>
        </div>
        {
            isModalOpen &&
            <Modal title="Новая колонка" onClose={closeHandler}>
                <form onSubmit={submitHandler} className={styles.form}>
                    <label>
                        Название
                        <input type="text" value={inputVal} onChange={inputOnChangeHandler}/>
                    </label>
                    <button className={styles.addButton}>Добавить</button>
                </form>
            </Modal>
        }
        </>
    )
}
export default AddColumn
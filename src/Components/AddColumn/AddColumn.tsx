import { useState } from 'react'
import styles from './AddColumn.module.css'
import Modal from '../Modal/Modal'
import { useDispatch } from 'react-redux'
import { addColumn } from '../../../boardSlice'

function AddColumn(){
    const [isModalOpen,setIsModalOpen] = useState(false)
    const [inputVal,setInputVal] = useState('')
    const dispatch = useDispatch()

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
        if(inputVal.trim().length > 0){
            dispatch(addColumn({id:crypto.randomUUID(),title:inputVal.trim()}))
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
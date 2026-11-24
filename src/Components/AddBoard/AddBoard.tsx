import { useState } from 'react'
import styles from './AddBoard.module.css'
import Modal from '../Modal/Modal'
import { useDispatch } from 'react-redux'
import { createBoard } from '../../../boardSlice'
import { type AppDispatch } from '../../../store'


function AddBoard(){
    const [isModalOpen,setIsModalOpen] = useState(false)
    const [inputVal,setInputVal] = useState('')
    const dispatch = useDispatch<AppDispatch>()

    function onCloseHandler(){
        setIsModalOpen(false)
    }
    function onOpenHandler(){
        setIsModalOpen(true)
    }
    function onChangeHandler(e:React.ChangeEvent<HTMLInputElement>){
        setInputVal(e.target.value)
    }
    function onSubmitHandler(e:React.FormEvent<HTMLFormElement>){
        e.preventDefault()
        if(inputVal.trim().length > 0){
            dispatch(createBoard({id:crypto.randomUUID(),name:inputVal.trim()}))
            setInputVal('')
            setIsModalOpen(false)
        }
    }

    return(
        <>
            <button className={styles.addTaskButton} onClick={onOpenHandler}>Добавить доску</button>
            {
                isModalOpen && <Modal title='Новая доска' onClose={onCloseHandler}>
                    <form onSubmit={onSubmitHandler} className={styles.form}>
                        <input type="text" onChange={onChangeHandler} value={inputVal}/>
                        <button className={styles.addButton}>Добавить</button>
                    </form>
                </Modal>
            }
        </>
    )
}
export default AddBoard
import { type RootState } from "../../../store"
import { useDispatch, useSelector } from "react-redux"
import styles from './ErrorToast.module.css'
import { type AppDispatch } from '../../../store'
import { cleanActionError } from "../../../boardSlice"

function ErrorToast(){
    const actionError = useSelector((state:RootState)=> state.board.actionError)
    const dispatch = useDispatch<AppDispatch>()

    function removeErrorMessage(){
        dispatch(cleanActionError())
    }

    if(!actionError){
        return null
    }

    return(
        <div className={styles.toast}>
            <span>{actionError}</span>
            <button className={styles.closeButton} aria-label="Закрыть" onClick={removeErrorMessage}></button>
        </div>
    )
}
export default ErrorToast
import styles from './Modal.module.css'
type ModalProps ={
    title:string,
    onClose:()=>void,
    children:React.ReactNode
}
function Modal({title,onClose,children}:ModalProps){
    return(
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeButton} onClick={onClose} aria-label="Закрыть"></button>
                <h3 className={styles.title}>{title}</h3>
                {children}
            </div>
        </div>
    )
}
export default Modal
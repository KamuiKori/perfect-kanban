import { useState } from 'react'
import styles from './FilterBar.module.css'
import { type Priority } from '../../../types'

function FilterBar({ searchValue, onSearchChange, priorityFilter, onPriorityChange }: { searchValue: string, onSearchChange: (value: string) => void, priorityFilter: Priority | 'all', onPriorityChange: (value: Priority | 'all') => void }){
    const [isOpen,setIsOpen] = useState(false)

    function toggleHandler(){
        setIsOpen(!isOpen)
    }

    return(
        <div className={styles.bar}>
            <button className={styles.toggle} onClick={toggleHandler}>
                <span>Фильтры</span>
                <span className={`${styles.arrow} ${isOpen?styles.arrowOpen:''}`}></span>
            </button>
            {isOpen && <div className={styles.panel}>
                <div className={styles.field}>
                    <label className={styles.label}>Название</label>
                    <input
                        className={styles.searchInput}
                        placeholder="Поиск по карточкам"
                        value={searchValue}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Срочность</label>
                    <select
                        className={styles.select}
                        value={priorityFilter}
                        onChange={(e) => onPriorityChange(e.target.value as Priority | 'all')}
                    >
                        <option value="all">Все</option>
                        <option value="low">Низкая</option>
                        <option value="medium">Средняя</option>
                        <option value="high">Высокая</option>
                    </select>
                </div>
            </div>}
        </div>
    )
}
export default FilterBar
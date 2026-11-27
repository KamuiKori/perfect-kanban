import { Routes,Route } from "react-router-dom"
import BoardPage from "./BoardPage"
import BoardSwitcher from "./Components/BoardSwitcher/BoardSwitcher"
import styles from './App.module.css'
import HomeRedirect from "./Components/HomeRedirect/HomeRedirect"
import ErrorToast from "./Components/ErrorToast/ErrorToast"
import FilterBar from "./Components/FilterBar/FilterBar"
import { useState } from "react"
import { type Priority } from "../types"

function App() {
  const [searchValue,setSearchValue] = useState('')
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all')

  return (
    <>
      <FilterBar
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        priorityFilter={priorityFilter}
        onPriorityChange={setPriorityFilter}
      />
      <div className={styles.boardWrapper}>
        <BoardSwitcher/>
        <ErrorToast/>
        <Routes>
          <Route path="/boards/:boardId" element={<BoardPage searchValue={searchValue} priorityFilter={priorityFilter}/>}></Route>
          <Route path="/" element={<HomeRedirect />} />
        </Routes>
      </div>
    </>
  )
}

export default App
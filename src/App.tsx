import { Routes,Route } from "react-router-dom"
import BoardPage from "./BoardPage"
import BoardSwitcher from "./Components/BoardSwitcher/BoardSwitcher"
import styles from './App.module.css'
import HomeRedirect from "./Components/HomeRedirect/HomeRedirect"

function App() {

  return (
    <div className={styles.boardWrapper}>
      <BoardSwitcher/>
      <Routes>
        <Route path="/boards/:boardId" element={<BoardPage/>}></Route>
        <Route path="/" element={<HomeRedirect />} />
      </Routes>
    </div>
    
  )
}

export default App

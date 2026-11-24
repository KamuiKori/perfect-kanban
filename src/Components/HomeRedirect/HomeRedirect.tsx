import { useSelector } from "react-redux"
import { type RootState } from "../../../store"
import { Navigate } from "react-router-dom"

function HomeRedirect(){
    const boards = useSelector((state:RootState)=>state.board.boards)
    if(boards.length === 0){
        return <p>Загрузка...</p>
    }
    return(
        <Navigate to={`/boards/${boards[0].id}`} replace />
    )
}
export default HomeRedirect
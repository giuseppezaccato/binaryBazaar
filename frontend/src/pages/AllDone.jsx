import { Link } from "react-router-dom"
import MatrixCodeRain from "../components/MatrixCodeRain"
export default function AllDone() {

    return (
        <>
            <MatrixCodeRain />
            <h1>ordine effettuato con successo</h1>
            <button><Link to='/home'>Torna alla Home</Link> </button>

        </>
    )
}
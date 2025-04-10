import { Link } from 'react-router-dom';
import "../style/Game.css"
import MatrixCodeRain from '../components/MatrixCodeRain';

export default function NotFound() {
    return (
        <>
            <MatrixCodeRain />
            <div className="game-container">
                <div className="game-content">
                    <h1 className="game-title animated-title flicker-effect">Oops! Pagina non trovata</h1>

                    <p className="game-instructions">
                        Sembra che la pagina che stai cercando non esista.<br />
                        Potresti aver digitato un URL sbagliato o la pagina è stata rimossa.
                    </p>
                    <div className="game-image">
                        <img
                            src="https://i0.wp.com/blog.oudel.com/wp-content/uploads/2022/07/error-404.png?fit=1024%2C682&ssl=1"
                            alt="404 Error"
                            style={{
                                maxWidth: '300px',
                                width: '100%',
                                height: 'auto',
                                margin: '2rem auto'
                            }}
                        />
                    </div>
                    <Link to="/" className=" float-end">
                        <button
                            className="rounded game-button glitch"
                        >
                            <span>
                                Torna alla Homepage
                            </span>
                        </button>

                    </Link>
                </div>
            </div>
        </>
    );
}
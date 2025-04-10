import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../style/Game.css'; // Importa il file CSS per gli stili
import MatrixCodeRain from "../components/MatrixCodeRain";
import { FaSkull } from 'react-icons/fa';


export default function DiscountGame() {
    const [targetNumber, setTargetNumber] = useState(null); // Numero da indovinare
    const [guess, setGuess] = useState(''); // Numero inserito dall'utente
    const [message, setMessage] = useState('Indovina un numero tra 1 e 100!'); // Messaggio di feedback
    const [isGameWon, setIsGameWon] = useState(false); // Stato per indicare se il gioco è stato vinto
    const [attempts, setAttempts] = useState(0); // Contatore dei tentativi
    const guessButtonRef = useRef(null);
    const [buttonPosition, setButtonPosition] = useState({ top: 'auto', left: 'auto' });

    // Genera un numero casuale quando il componente viene montato
    useEffect(() => {
        resetGame();
    }, []);

    // Funzione per resettare il gioco
    const resetGame = () => {
        const randomNumber = Math.floor(Math.random() * 100) + 1; // Numero casuale tra 1 e 100
        setTargetNumber(randomNumber);
        setGuess('');
        setMessage('Indovina un numero tra 1 e 100!');
        setIsGameWon(false);
        setAttempts(0);
        setButtonPosition({ top: 'auto', left: '0' }); // Resetta la posizione del bottone
    };

    // Gestisce il cambio dell'input
    const handleInputChange = (e) => {
        setGuess(e.target.value);
    };
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevents form submission on Enter
        }
    };

    // Gestisce il tentativo di indovinare
    const handleGuess = (e) => {
        e.preventDefault();
        const userGuess = parseInt(guess, 10);
        setAttempts(attempts + 1);
        setGuess('')

        // Controlla se l'input è valido
        if (isNaN(userGuess) || userGuess < 1 || userGuess > 100) {
            setMessage('Per favore, inserisci un numero valido tra 1 e 100.');
            return;
        }

        // Confronta il numero inserito con il numero target
        if (userGuess === targetNumber) {
            setMessage(`Congratulazioni! Hai indovinato in ${attempts + 1} tentativi!`);
            setIsGameWon(true);
        } else if (userGuess > targetNumber) {
            setMessage('Troppo alto! Prova un numero più basso.');
        } else {
            setMessage('Troppo basso! Prova un numero più alto.');
        }
    };

    const handleButtonHover = () => {
        if (isGameWon || !guessButtonRef.current || !guessButtonRef.current.parentElement) {
            return;
        }

        const parentRect = guessButtonRef.current.parentElement.getBoundingClientRect();
        const buttonRect = guessButtonRef.current.getBoundingClientRect();

        const maxX = parentRect.width - buttonRect.width;
        const maxY = parentRect.height - buttonRect.height;

        const randomX = Math.random() * maxX;
        const randomY = Math.random() * maxY;

        setButtonPosition({ bottom: `${randomY}px`, top: `${randomY}px`, left: `${randomX}px` });
    };

    const handleButtonMouseLeave = () => {
        // Opzionale: puoi resettare la posizione quando il mouse esce,
        // ma in questo caso vogliamo che rimanga dove è stato spostato.
        //setButtonPosition({ top: 'auto', left: 'auto' });
    };

    return (
        <>
            <MatrixCodeRain />
            <div className="game-container">
                <h1 className="game-title flicker-effect">GUESS && LESS</h1>
                <h2 className="game-title ">Indovina il Numero e Vinci uno Sconto!</h2>
                <p className="game-instructions flicker-effect">
                    Indovina il numero segreto (tra 1 e 100) <br /> per ottenere un codice sconto del 10%! <br />
                    E se indovini entro 10 Tentativi il bonus è TRIPLO! <br />
                    AH...il bottone fa un pò come gli pare!<FaSkull />
                </p>
                <p className="game-attempts">Tentativi: {attempts}</p>
                <p className="game-message">{message}</p>

                {isGameWon ? (
                    <div className="game-won">
                        <h2 className="game-won-title">Hai Vinto!</h2>
                        <p className="game-won-code"> Codice Sconto: <strong>{attempts < 10 ? "ARTUR30" : "LORIS10"}</strong></p>
                        <button className="game-button glitch" onClick={resetGame}>
                            Riprova
                        </button>
                        <button className="game-button mx-2 glitch" > <Link to={'/checkout'}>Checkout</Link>

                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleGuess} className="game-form">
                        <input
                            type="number"
                            value={guess}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            placeholder="Inserisci un numero"
                            className="game-input"
                            min="1"
                            max="100"
                            required
                        />
                        <button
                            ref={guessButtonRef}
                            type="submit"
                            className="rounded glitch game-button "
                            style={{
                                position: 'absolute',
                                top: buttonPosition.top,
                                left: buttonPosition.left,
                                cursor: 'pointer',
                            }}
                            onMouseEnter={handleButtonHover}
                            onMouseLeave={handleButtonMouseLeave}
                        >
                            INDOVINA
                        </button>
                    </form>
                )}
            </div>
            <div className="light-bar"></div>
        </>
    );
}
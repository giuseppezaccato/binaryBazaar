import { useEffect, useState } from 'react';
import '../style/Credits.css';

export default function Credits() {
    const [startScroll, setStartScroll] = useState(false);


    const credits = [
        { role: "The Architects", names: ["Giuseppe", "Manuel", "Igor", "Riccardo"] },
        { role: "Presentazione", fact: "Benvenuti nel nostro viaggio attraverso il codice. Un'avventura iniziata con quattro sviluppatori e infinite tazze di caffè..." },
        { role: "The Team", fact: "Un ringraziamento speciale al nostro team che ha reso possibile questo progetto:" },
        { role: "Giuseppe", fact: "Il nostro Morpheus, che ci ha guidato attraverso le complessità di React" },
        { role: "Manuel", fact: "Il nostro Neo, che ha piegato il codice alla sua volontà" },
        { role: "Igor", fact: "Il nostro Oracle, maestro del CSS e domatore di media queries" },
        { role: "Riccardo", fact: "Il nostro Tank, che ha hackerato ogni bug fino alla vittoria" },
        { role: "Matrix Facts", fact: "Did you know? The 'digital rain' in Matrix was actually created from Japanese sushi recipes!" },
        {
            role: "Special Thanks", names: [
                "Boolean - Per averci mostrato quanto in profondità va la tana del bianconiglio",
                "Stack Overflow - Il nostro oracolo personale",
                "Coffee ☕ - Il carburante degli Architetti",
                "Pizza 🍕 - Per il sostegno nutritivo",
                "React Documentation - Che abbiamo effettivamente letto (a volte)"
            ]
        },
        { role: "Fun Facts", fact: "Durante lo sviluppo sono stati consumati: 999 caffè, 42 pizze, e 0 pillole blu" },
        { role: "Debug Stories", fact: "Nessun computer è stato lanciato dalla finestra durante lo sviluppo di questo progetto (quasi)" },
        { role: "Warning", fact: "Qualsiasi somiglianza con bug realmente esistenti è puramente casuale" },
        { role: "Remember", fact: "Matrix ci ha insegnato che ogni bug è un'opportunità... di fare una pausa caffè" }
    ];

    useEffect(() => {
        setStartScroll(true);
    }, []);

    return (
        <div className="credits-container matrix-bg">
            <div className={`credits-content ${startScroll ? 'scrolling' : ''}`}>
                <h1>The Binary Bazaar</h1>
                <h2>A Matrix-inspired E-commerce</h2>

                {credits.map((credit, index) => (
                    <div key={index} className="credit-item">
                        <h3>{credit.role}</h3>
                        {credit.names && (
                            <div className="names">
                                {credit.names.map((name, i) => (
                                    <p key={i}>{name}</p>
                                ))}
                            </div>
                        )}
                        {credit.fact && <p className="fact">{credit.fact}</p>}
                    </div>
                ))}

                <div className="final-message">
                    <p>Take the red pill...</p>
                    <p>And I'll show you how deep the rabbit hole of debugging goes</p>

                </div>

                <h2>Grazie per aver creduto in Binary Bazaar</h2>
                <h3>Remember... All We're offering is the truth, and free shipping on orders over 50€</h3>

            </div>
        </div>
    );
}
import React, { useState, useEffect } from 'react';
import "../style/ScrollUp.css"

export default function ScrollUp() {
    const [showScrollTop, setShowScrollTop] = useState(false);

    // Funzione per controllare la posizione dello scroll
    const handleScroll = () => {
        const footer = document.querySelector('footer'); // Seleziona il footer
        if (!footer) return;

        const footerPosition = footer.getBoundingClientRect().top; // Distanza del footer dal top della viewport
        const windowHeight = window.innerHeight; // Altezza della finestra

        // Mostra il pulsante se il footer è visibile o vicino (entro 200px dal fondo)
        if (footerPosition < windowHeight + 20) {
            setShowScrollTop(true);
        } else {
            setShowScrollTop(false);
        }
    };

    // Funzione per tornare in cima
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Aggiungi listener per lo scroll
    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll); // Cleanup
    }, []);


    return (
        <>

            {/* Pulsante "torna su" */}
            {showScrollTop && (
                <button className="scroll-top-btn" onClick={scrollToTop}>
                    ↑
                </button>
            )}

        </>
    )
}
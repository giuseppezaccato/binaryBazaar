import React, { useState, useEffect, useRef } from 'react';
import '../style/Chatbot.css'; // Stile
// import OpenAI from 'openai' //API REQ OPENAI
// import { GoogleGenAI } from "@google/genai"; //API REQ GEMINI





const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false); // Stato per aprire/chiudere il chatbot
    const [messages, setMessages] = useState([
        { text: "Ciao! Somo Morpheus, il tuo assistente Personale, come posso aiutarti? (digita /help per conoscere la lista dei comandi)", sender: "bot" }
    ]); // Stato per i messaggi
    const [input, setInput] = useState(""); // Stato per l'input dell'utente

    // Toggle per aprire/chiudere il chatbot
    const toggleChatbot = () => {
        setIsOpen(!isOpen);
    };

    //*CHIAMATE CON TOKEN AI DEEPSEEK/OPENAI/GIMINI
    //! API REQ OPENAI ==> bash: `npm install openai`
    // const openai = new OpenAI({
    //     apiKey: import.meta.env.VITE_OPENAI_API_KEY, // Idealmente in .env: process.env.OPENAI_API_KEY
    //     dangerouslyAllowBrowser: true // Solo per test, non usare in produzione
    // });

    // const handleSendOA = async () => {
    //     if (input.trim() === "") return;

    //     // Aggiungi il messaggio dell'utente
    //     setMessages(prev => [...prev, { text: input, sender: "user" }]);

    //     try {
    //         // Mostra loading state
    //         setMessages(prev => [...prev, { text: "Sto pensando...", sender: "bot", isLoading: true }]);

    //         const completion = await openai.chat.completions.create({
    //             messages: [{ role: "user", content: input }],
    //             model: "gpt-3.5-turbo",
    //         });

    //         // Rimuovi il loading message e aggiungi la risposta
    //         setMessages(prev => {
    //             const withoutLoading = prev.filter(msg => !msg.isLoading);
    //             return [...withoutLoading, {
    //                 text: completion.choices[0].message.content,
    //                 sender: "bot"
    //             }];
    //         });
    //     } catch (error) {
    //         console.error('Error:', error);
    //         setMessages(prev => {
    //             const withoutLoading = prev.filter(msg => !msg.isLoading);
    //             return [...withoutLoading, {
    //                 text: "Mi dispiace, c'è stato un errore. Riprova più tardi.",
    //                 sender: "bot"
    //             }];
    //         });
    //     }

    //     setInput("");
    // };


    // //! API REQ DEEPSEEK
    // const handleSendDS = async () => {
    //     if (input.trim() === "") return;

    //     // Aggiungi il messaggio dell'utente
    //     setMessages(prev => [...prev, { text: input, sender: "user" }]);

    //     try {
    //         // Mostra loading state
    //         setMessages(prev => [...prev, { text: "Sto pensando...", sender: "bot", isLoading: true }]);

    //         const response = await fetch('https://api.deepseek.com/chat/completions', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': `Bearer ${import.meta.env.VITE_DEEPSEEK_API_KEY}` //!CHIAVE API QUI
    //             },
    //             body: JSON.stringify({
    //                 model: "deepseek-chat",
    //                 messages: [
    //                     {
    //                         role: "system",
    //                         content: "Sei un assistente di un e-commerce di laptop e accessori chiamato Binary Bazaar. Rispondi in modo conciso e professionale."
    //                     },
    //                     {
    //                         role: "user",
    //                         content: input
    //                     }
    //                 ],
    //                 max_tokens: 150
    //             })
    //         });

    //         if (!response.ok) {
    //             throw new Error('Network response was not ok');
    //         }

    //         const data = await response.json();

    //         // Rimuovi il loading message e aggiungi la risposta
    //         setMessages(prev => {
    //             const withoutLoading = prev.filter(msg => !msg.isLoading);
    //             return [...withoutLoading, {
    //                 text: data.choices[0].message.content,
    //                 sender: "bot"
    //             }];
    //         });
    //     } catch (error) {
    //         console.error('Error:', error);
    //         setMessages(prev => {
    //             const withoutLoading = prev.filter(msg => !msg.isLoading);
    //             return [...withoutLoading, {
    //                 text: "Mi dispiace, c'è stato un errore. Riprova più tardi.",
    //                 sender: "bot"
    //             }];
    //         });
    //     }

    //     setInput("");
    // };

    // Gestione tasto Enter



    //! API REQ GEMINI  ==> `npm install @google/genai`
    // const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

    // async function main() {
    //     const response = await ai.models.generateContent({
    //         model: "gemini-2.0-flash",
    //         contents: "Explain how AI works",
    //     });
    //     console.log(response.text);
    // }

    //!OCCHIO SOLO QUESTO O QUELLO DI SOTTO

    // const handleSendGEM = async () => {
    //     if (input.trim() === "") return;

    //     const userMessage = input.toLowerCase();
    //     setMessages(prev => [...prev, { text: input, sender: "user" }]);

    //     try {
    //         // Prima controlla se è un comando predefinito
    //         if (predefinedResponses.greetings.some(greeting => userMessage.includes(greeting))) {
    //             setMessages(prev => [...prev, {
    //                 text: predefinedResponses.greetingResponse,
    //                 sender: "bot"
    //             }]);
    //         } else if (Object.entries(predefinedResponses.keywords).some(([keyword, response]) => {
    //             if (userMessage.includes(keyword)) {
    //                 setMessages(prev => [...prev, { text: response, sender: "bot" }]);
    //                 return true;
    //             }
    //             return false;
    //         })) {
    //             // Se è stato trovato un comando predefinito, non fa nulla qui
    //         } else {
    //             // Se non è un comando predefinito, usa Gemini
    //             setMessages(prev => [...prev, {
    //                 text: "Sto pensando...",
    //                 sender: "bot",
    //                 isLoading: true
    //             }]);

    //             const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });

    //             const prompt = `Sei Morpheus, un assistente virtuale dell'e-commerce Binary Bazaar che vende laptop e accessori.
    //                           Rispondi in modo conciso e professionale alla seguente domanda: ${input}
    //                           Limita la risposta a massimo 100 parole.`;

    //             const result = await model.generateContent(prompt);
    //             const response = await result.response;
    //             const text = response.text();

    //             setMessages(prev => {
    //                 const withoutLoading = prev.filter(msg => !msg.isLoading);
    //                 return [...withoutLoading, {
    //                     text: text,
    //                     sender: "bot"
    //                 }];
    //             });
    //         }
    //     } catch (error) {
    //         console.error('Error:', error);
    //         setMessages(prev => {
    //             const withoutLoading = prev.filter(msg => !msg.isLoading);
    //             return [...withoutLoading, {
    //                 text: "Mi dispiace, c'è stato un errore. Riprova più tardi.",
    //                 sender: "bot"
    //             }];
    //         });
    //     }

    //     setInput("");
    // };

    //!soluzione GRATIS

    const predefinedResponses = {
        keywords: {
            // Comandi di base
            '/help': `Ecco i comandi disponibili:
            • /prezzi - Info sui prezzi
            • /spedizione - Info sulle spedizioni
            • /sconti - Info sugli sconti
            • /pagamenti - Metodi di pagamento
            • /resi - Politica dei resi
            • /assistenza - Contatta assistenza
            • /garanzia - Info sulla garanzia
            • /orari - Orari assistenza
            • /ordini - Traccia ordini
            • /contatti - Info contatti
            • /outlet - Scopri le offerte outlet
            • /newsletter - Iscriviti alla newsletter
            • /regalo - Servizio regalo
            • /aziende - Info B2B
            • /codice - Codici sconto disponibili
            • /lavora - Lavora con noi
            • /rimborso - Info sui rimborsi
            • /sede - Vienici a Trovare in sede
            • /riparazione - Info Riparazioni in garanzia
            • /DEI-????? do you want to try?
            `,

            // Info prodotti
            'prezz': 'I nostri prezzi sono molto competitivi. Puoi trovare tutti i prodotti nella sezione "I Nostri Prodotti".',
            'laptop': 'Abbiamo una vasta gamma di laptop per ogni esigenza: gaming, business, studio. Visita la sezione "I Nostri Prodotti"!',
            'gaming': 'I nostri laptop gaming hanno prestazioni eccezionali e schede grafiche di ultima generazione.',
            'business': 'Per il business offriamo laptop leggeri, con ottima autonomia e sicurezza avanzata.',
            'accessori': 'Trovi tutti gli accessori nella sezione dedicata: mouse, tastiere, zaini, supporti e molto altro.',

            // Assistenza e supporto
            'spedizione': 'La spedizione è gratuita per ordini superiori a 50€. Consegniamo in 2-3 giorni lavorativi.',
            'tracking': 'Puoi tracciare il tuo ordine nella sezione "I miei ordini" usando il numero di tracking.',
            'scont': 'Puoi ottenere uno sconto giocando al nostro gioco nella sezione "Gioco & Sconti"!',
            'codice': 'Usa il codice WELCOME10 per ottenere il 10% di sconto sul tuo primo acquisto, o SUMMER25 per uno sconto del 25% sui prodotti estivi!',
            'pagamento': 'Accettiamo tutti i principali metodi di pagamento: carte di credito, PayPal e bonifico bancario.',
            'reso': 'Hai 14 giorni per restituire il prodotto se non sei soddisfatto.',
            'rimborso': 'I rimborsi vengono elaborati entro 5-7 giorni lavorativi dalla ricezione del reso.',
            'assistenza': 'Il nostro team di assistenza è disponibile dal lunedì al venerdì, dalle 9:00 alle 18:00, contattaci via Email: support@binarybazaar.com oppure al +39 123456789 ',
            'garanzia': 'Tutti i nostri prodotti hanno 2 anni di garanzia.',
            'riparazione': 'Per riparazioni in garanzia, contatta il nostro servizio assistenza.',
            'dei': 'I MIEI CREATORI (DEI) SONO:GIUSEPPE,MANUEL,IGOR(IVAN DRAGO.css),RICCARDO....RESPECT',

            // Info aziendali
            'contatt': 'Email: support@binarybazaar.com - Tel: +39 123456789',
            'sede': 'La nostra sede è a Milano, in Via HiTech 42.',
            'chi siamo': 'Binary Bazaar è il tuo shop di fiducia per laptop e accessori dal 2024.',
            'lavor': 'Vuoi lavorare con noi? Invia il tuo CV a careers@binarybazaar.com',

            // Extra servizi
            'newsletter': 'Iscriviti alla newsletter per ricevere offerte esclusive!',
            'regalo': 'Offriamo servizio di pacchetto regalo e biglietto personalizzato.',
            'aziende': 'Per ordini aziendali, contatta il nostro ufficio B2B.',
            'outlet': 'Visita la sezione Outlet per trovare occasioni imperdibili!',

            // Risposta default
            'default': 'Non ho capito. Digita /help per vedere i comandi disponibili.'
        },
        greetings: ['ciao', 'salve', 'buongiorno', 'buonasera', 'hey', 'hi', 'hola', 'ehi'],
        greetingResponse: 'Ciao! Sono Morpheus, come posso aiutarti? Digita /help per vedere i comandi disponibili.'
    };

    // Modifica la funzione handleSend
    const handleSend = () => {
        if (input.trim() === "") return;

        const userMessage = input.toLowerCase();
        setMessages(prev => [...prev, { text: input, sender: "user" }]);

        // Gestione della risposta
        setTimeout(() => {
            let botResponse = predefinedResponses.keywords.default;

            // Controlla se è un saluto
            if (predefinedResponses.greetings.some(greeting => userMessage.includes(greeting))) {
                botResponse = predefinedResponses.greetingResponse;
            } else {
                // Cerca nelle parole chiave
                for (const [keyword, response] of Object.entries(predefinedResponses.keywords)) {
                    if (userMessage.includes(keyword)) {
                        botResponse = response;
                        break;
                    }
                }
            }

            setMessages(prev => [...prev, { text: botResponse, sender: "bot" }]);
        }, 1000);

        setInput("");
    };


    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSend();
        }
    };

    // Aggiungi una ref per il container dei messaggi
    const messagesEndRef = useRef(null);

    // Funzione per scrollare in basso
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    // useEffect per scrollare quando vengono aggiunti nuovi messaggi
    useEffect(() => {
        scrollToBottom();
    }, [messages]);


    return (
        <div className="chatbot-container">
            {/* Pulsante per aprire/chiudere */}
            {!isOpen && (
                <button className="chatbot-toggle" onClick={toggleChatbot}>
                    💬
                </button>
            )}

            {/* Finestra del chatbot */}
            {isOpen && (
                <div className={`chatbot-window ${isOpen ? 'open' : ''}`}>
                    <div className="chatbot-header">
                        <span>Morpheus</span>
                        <button className="chatbot-close" onClick={toggleChatbot}>
                            ✕
                        </button>
                    </div>
                    <div className="chatbot-messages">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`message ${msg.sender === "user" ? "user" : "bot"}`}
                            >
                                {msg.text}
                            </div>
                        ))}
                        {/* Elemento div vuoto per il riferimento dello scroll */}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="chatbot-input">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder="Scrivi qui..."
                        />
                        <button onClick={handleSend}>Invia</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
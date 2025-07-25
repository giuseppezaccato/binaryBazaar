# BinaryBazaar 🛍️

Benvenuto in BinaryBazaar! Questo progetto è un'applicazione web full-stack che funge da scheletro per una piattaforma di e-commerce, con un backend robusto basato su Node.js e un frontend reattivo costruito con React.

## ✨ Caratteristiche

-   **Backend API RESTful:** Server costruito con Express.js per gestire la logica di business e le interazioni con il database.
-   **Frontend Moderno:** Interfaccia utente creata con React e Vite per un'esperienza di sviluppo veloce e performante.
-   **Database MySQL:** Utilizza MySQL per la persistenza dei dati, come prodotti e utenti.
-   **Struttura Modulare:** Codice organizzato in modo chiaro, separando frontend e backend per una migliore manutenibilità.

## 🛠️ Tecnologie Utilizzate

| Categoria | Tecnologia                                                                                                                              |
| :-------- | :-------------------------------------------------------------------------------------------------------------------------------------- |
| **Backend**   | ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white) ![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white) ![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white) |
| **Frontend**  | ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white) |
| **Linguaggi** | ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black) |

## 📂 Struttura del Progetto

Il progetto è diviso in due directory principali:

-   `backend/`: Contiene tutto il codice lato server (Node.js, Express, routes, controllers, connessione al DB).
-   `frontend/`: Contiene l'applicazione client (React, Vite, componenti, stili).

## 🚀 Guida all'Installazione e Avvio

Per eseguire il progetto in locale, segui questi passaggi.

### Prerequisiti

Assicurati di avere installato sul tuo sistema:
-   Node.js (versione 14 o superiore)
-   npm
-   Un server MySQL in esecuzione.

### 1. Clonare il Repository

```bash
git clone https://github.com/giuseppezaccato/binaryBazaar.git
cd binaryBazaar
```

### 2. Configurazione del Backend

1.  Naviga nella cartella del backend:
    ```bash
    cd backend
    ```

2.  Crea un file `.env` nella directory `backend/` e configuralo con le tue credenziali. Usa il seguente template:
    ```env
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=your_password # Sostituisci con la tua password
    DB_NAME=binary_bazaar
    SERVER_PORT=3000
    FRONTEND_PORT=http://localhost:5173
    ```

3.  Assicurati di aver creato un database in MySQL con il nome specificato in `DB_NAME` (es. `binary_bazaar`).

4.  Installa le dipendenze:
    ```bash
    npm install
    ```

5.  Avvia il server backend:
    ```bash
    node app.js
    ```
    Il server sarà in ascolto sulla porta 3000 (o quella specificata in `.env`).

### 3. Configurazione del Frontend

1.  Apri un nuovo terminale e naviga nella cartella del frontend:
    ```bash
    cd frontend
    ```

2.  Installa le dipendenze:
    ```bash
    npm install
    ```

3.  Avvia il server di sviluppo:
    ```bash
    npm run dev
    ```
    L'applicazione sarà accessibile all'indirizzo `http://localhost:5173`.

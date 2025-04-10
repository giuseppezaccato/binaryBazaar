
import connection from '../data/db.js';
import nodemailer from 'nodemailer';

function createOrder(req, res) {
    const { name, lastname, email, address, telephone, products, promotion_code } = req.body;

    // Validazione campi input
    if (!name || !lastname || !email || !address || !products || !Array.isArray(products)) {
        return res.status(400).json({ error: "Dati Mancanti nei campi: Nome, Cognome, Indirizzo, Prodotto, Email...sono obbligatori" });
    }

    // Azzeramento dei counter
    let total = 0;
    let promotion_id = null;

    // Configurazione del transporter di Nodemailer con Mailtrap
    const transporter = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: process.env.MAILTRAP_USER,
            pass: process.env.MAILTRAP_PASS // Sostituisci con la password reale di Mailtrap
        }
    });

    function sendOrderConfirmationEmail(orderId, customerEmail, customerName, total, products, promotion_id, callback) {
        // Genera l'elenco dei prodotti per l'email
        const productList = products.map(item => {
            return `<li>${item.name} - Quantità: ${item.quantity} - Prezzo unitario: ${item.price.toFixed(2)} €</li>`;
        }).join('');

        // Funzione per recuperare i dettagli della promozione (se esiste)
        function getPromotionDetails(callback) {
            if (!promotion_id) {
                return callback(null, null); // Nessuna promozione, procedi senza dettagli
            }

            const promoSql = `
                SELECT code, discount
                FROM promotions
                WHERE promotion_id = ?
            `;
            connection.query(promoSql, [promotion_id], (err, promoResults) => {
                if (err) {
                    console.error('Errore nel recupero della promozione:', err);
                    return callback(null, null); // In caso di errore, procedi senza i dettagli della promo
                }
                if (promoResults.length > 0) {
                    return callback(null, promoResults[0]);
                }
                callback(null, null); // Nessuna promozione trovata
            });
        }

        // Recupera i dettagli della promozione e poi invia l'email
        getPromotionDetails((err, promoDetails) => {
            // Costruisci il messaggio della promozione (se esiste)
            const promoMessage = promoDetails
                ? `<p><strong>Promozione applicata:</strong> Codice "${promoDetails.code}" - Sconto: ${promoDetails.discount}%</p>`
                : '';

            const mailOptions = {
                from: 'noreply@binarybazaarassistant.com', // Mittente
                to: customerEmail, // Destinatario (email del cliente)
                subject: 'Conferma del tuo ordine - BinaryBazaar',
                html: `
                    <h1>Grazie per il tuo ordine, ${customerName}!</h1>
                    <p>Il tuo ordine è stato ricevuto con successo. Ecco i dettagli:</p>
                    <p><strong>Numero ordine:</strong> ${orderId}</p>
                    <p><strong>Prodotti:</strong></p>
                    <ul>${productList}</ul>
                    ${promoMessage}
                    <p><strong>Totale:</strong> ${total.toFixed(2)} €</p>
                    <p>Ti contatteremo presto per la spedizione. Grazie per aver scelto BinaryBazaar!</p>
                    <p>Per qualsiasi domanda, contattaci a support@BinaryBazaar.com</p>
                    <p>Non rispondere a questa mail</p>
                `
            };

            // Invia la mail con una callback
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Errore durante l\'invio della mail:', error);
                    return callback(error); // Passa l'errore alla callback
                }
                console.log('Email di conferma inviata a:', customerEmail, 'Info:', info.response);
                callback(null); // Nessun errore, procedi
            });
        });
    }

    // Funzione unica di inserimento dell'ordine e del calcolo del totale
    function calculateTotalAndInsertOrder() {
        let processedProducts = 0;

        // Verifica dei prodotti e calcolo del totale
        products.forEach((p, index) => {
            const sql = 'SELECT product_id, price, discount_price, stock, name FROM products WHERE slug = ?';
            connection.query(sql, [p.slug], (err, results) => {
                if (err) {
                    return res.status(500).json({ error: "Errore lato server" });
                }

                // Controllo quantità in magazzino
                if (results.length === 0 || results[0].stock < p.quantity) {
                    return res.status(400).json({ error: `Prodotto ${p.slug} non disponibile o stock insufficiente` });
                }


                // Converti price e discount_price in numeri
                const price = parseFloat(results[0].discount_price || results[0].price);



                // Calcolo totale in base alla quantità
                total += price * p.quantity;

                // //*calcolo spedizione gratuita SE total supera i 50 €
                // total < 50 ? total + 10 : total

                // Aggiornamento sul product_id, prezzo e name
                products[index] = {
                    slug: p.slug,
                    product_id: results[0].product_id,
                    quantity: p.quantity,
                    price,
                    name: results[0].name
                };

                processedProducts++;

                if (processedProducts === products.length) {
                    applicaPromo(); // Richiamo funzione sconto
                }
            });
        });
    }

    function applicaPromo() {
        if (promotion_code) {
            const promoSql = `
                SELECT promotion_id, discount
                FROM promotions
                WHERE code = ? AND valid_from <= CURDATE() AND valid_to >= CURDATE()
            `;
            connection.query(promoSql, [promotion_code], (err, promoResults) => {
                if (err) {
                    return res.status(500).json({ error: "Errore lato server" });
                }

                // Applicazione sconto
                if (promoResults.length > 0) {
                    promotion_id = promoResults[0].promotion_id;
                    const discount = promoResults[0].discount;
                    total = total * (1 - discount / 100);
                }
                insertOrder();
            });
        } else {
            insertOrder();
        }
    }

    function insertOrder() {
        const orderSql = `
            INSERT INTO orders (name, lastname, email, address, telephone, order_date, total, promotion_id)
            VALUES (?, ?, ?, ?, ?, NOW(), ?, ?)
        `;
        connection.query(orderSql, [name, lastname, email, address, telephone || null, total, promotion_id || null], (err, orderResult) => {
            if (err) {
                return res.status(500).json({ error: "Errore lato server" });
            }

            const orderId = orderResult.insertId;
            const orderDetailsSql = `
                INSERT INTO product_order (order_id, product_id, quantity, price, name)
                VALUES ?
            `;
            const orderDetailsValues = products.map(item => [orderId, item.product_id, item.quantity, item.price, item.name]);

            connection.query(orderDetailsSql, [orderDetailsValues], (err) => {
                if (err) {
                    return res.status(500).json({ error: "Errore lato server" });
                }

                // Aggiorno stock da SQL (contatore)
                let updateStock = 0;

                products.forEach(item => {
                    const sql = `
                        UPDATE products SET stock = stock - ?
                        WHERE product_id = ?
                    `;
                    connection.query(sql, [item.quantity, item.product_id], (err) => {
                        if (err) {
                            return res.status(500).json({ error: "Errore lato server" });
                        }

                        // Aggiorno stock
                        updateStock++;

                        if (updateStock === products.length) {
                            // Invio la mail di conferma dopo aver aggiornato lo stock
                            sendOrderConfirmationEmail(orderId, email, name, total, products, promotion_id, (emailError) => {
                                if (emailError) {
                                    console.error('Errore invio mail, ma ordine completato:', emailError);
                                }

                                // Rispondi al client con il successo dell'ordine
                                res.status(201).json({
                                    order_id: orderId,
                                    message: "Ordine effettuato con successo",
                                    total: `${total.toFixed(2)}`
                                });
                            });
                        }
                    });
                });
            });
        });
    }

    // Avvio processo globale
    calculateTotalAndInsertOrder();
}

export { createOrder };

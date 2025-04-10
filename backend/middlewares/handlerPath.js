//dichiaro ed esporto la mia funzione middleware che costruisce il path parziale dell'immagine
export default function handleImagePath(req, res, next) {
    req.imagePath = `${req.protocol}://${req.get('host')}/images/`;
    next();
}
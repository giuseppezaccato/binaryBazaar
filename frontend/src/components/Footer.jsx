import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaInstagram, FaFacebook} from 'react-icons/fa';
import { BsTwitterX } from "react-icons/bs";
import "../style/Footer.css"

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section">
                    <img src="/Logo.png" alt="Binary Bazaar" className="footer-logo" />
                </div>

                <div className="footer-section">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><Link to="/home">Home</Link></li>
                        <li><Link to="/products">Prodotti</Link></li>
                        <li><Link to="/gameDiscount">Gioco & Sconti</Link></li>
                        <li><Link to="/credits">Credits</Link></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>Contatti</h4>
                    <ul>
                        <li>Email: info@binarybazaar.com</li>
                        <li>Tel: +39 123 456 7890</li>
                    </ul>
                </div>

                <div className="footer-section social-links">
                    <h4>Social</h4>
                    <div className="social-icons d-flex justify-content-center">
                        <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer">
                            <FaGithub size={24} />
                        </a>
                        <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer">
                            <FaLinkedin size={24} />
                        </a>
                        <a href="https://instagram.com/binarybazaar" target="_blank" rel="noopener noreferrer">
                            <FaInstagram size={24} />
                        </a>
                        <a href="https://facebook.com/binarybazaar" target="_blank" rel="noopener noreferrer">
                            <FaFacebook size={24} />
                        </a>
                        <a href="https://twitter.com/binarybazaar" target="_blank" rel="noopener noreferrer">
                            <BsTwitterX size={24} />
                        </a>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; 2025 Binary Bazaar. All rights reserved.</p>
            </div>
        </footer>
    );
}
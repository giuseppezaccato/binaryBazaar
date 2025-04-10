import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Chatbot from "../components/ChatBot";
import CartOffcanvas from "../components/CartOffcanvas";
import ScrollUp from "../components/ScrollUpArrow";
import WelcomePopup from "../components/WelcomePopup";


export default function DefaultLayout() {
    const location = useLocation()
    const isRightPath =
        location.pathname === '/home' ||
        location.pathname.startsWith('/products')

    // Gestione dello ScrollUp
    const shouldShowScrollUp = () => {
        // Dividiamo il pathname in parti usando lo slash
        const pathParts = location.pathname.split('/');

        // Array delle rotte dove ScrollUp non deve apparire
        const hideScrollUpRoutes = [
            'gameDiscount',
            'allDone',
            '*' // Per NotFound
        ];

        // Nascondi ScrollUp se:
        // 1. Siamo in una pagina prodotto (/products/:slug/)
        // 2. Siamo in una delle rotte specificate
        return !(
            (pathParts[1] === 'products' && pathParts[2]) ||
            hideScrollUpRoutes.includes(pathParts[1])
        );
    };


    // Funzione per scrollare in alto
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Scroll immediato al cambio di rotta (NavLink, Link, Navigate)
    useEffect(() => {
        scrollToTop();
    }, [location.pathname]); // Si attiva a ogni cambio di percorso

    return (
        <>
            <Header />
            <main className="main-box">
                <Outlet />
                <WelcomePopup />
                {/* Header, nav, contenuto, footer ecc. */}
            </main>
            {isRightPath && <Chatbot />}
            <CartOffcanvas />
            {shouldShowScrollUp() && <ScrollUp />}
            <Footer />

        </>
    );
}
import React, { useContext } from "react"
import { useLocation } from "react-router-dom"
import Header from "../components/Header/Header"
import Footer from "../components/Footer/Footer"
import Routers from "../routes/Routers"
import { AuthContext } from "../context/AuthContext"

const Layout = () => {
    const location = useLocation();
    const { role } = useContext(AuthContext);
    
    // Don't show header/footer for admin dashboard
    const isAdminRoute = location.pathname === '/admin' && role === 'admin';
    
    return (
        <>
            {!isAdminRoute && <Header />}
            <main>
                <Routers />
            </main>
            {!isAdminRoute && <Footer />}
        </>
    );
}

export default Layout

import React from 'react'
import { Link } from 'react-router-dom'

export const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">

                <div>
                    <div className="footer-brand">
                        AncientVault YGO
                    </div>
                    <p className="footer-text">
                        Plataforma para la gestión de colecciones
                        de cartas de Yu‑Gi‑Oh!.
                    </p>
                </div>

                {/* Cambiar por Link */}
                <div className="footer-links">
                    <span className="text-white font-medium mb-2">Plataforma</span>
                    <Link to="/">
                        <button className='footer-link'>Inicio</button>
                    </Link>
                    <Link to="/login">
                        <button className='footer-link'>Iniciar sesión</button>
                    </Link>
                    <Link to="/register">
                        <button className='footer-link'>Registrarse</button>
                    </Link>
                </div>


                <div className="footer-links">
                    <span className="text-white font-medium mb-2">Proyecto</span>
                    <span className="footer-text">
                        Proyecto académico · Desarrollo Web
                    </span>
                    <span className="footer-text">
                        AncientVault YGO © {new Date().getFullYear()}
                    </span>
                </div>

            </div>

            <div className="footer-bottom">
                © {new Date().getFullYear()} AncientVault YGO. Todos los derechos reservados.
            </div>
        </footer>
    )
}

import React from 'react'

export const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">

                {/* Brand */}
                <div>
                    <div className="footer-brand">
                        AncientVault YGO
                    </div>
                    <p className="footer-text">
                        Plataforma para la gestión de colecciones
                        de cartas de Yu‑Gi‑Oh!.
                    </p>
                </div>

                {/* Links */}
                <div className="footer-links">
                    <span className="text-white font-medium mb-2">Plataforma</span>
                    <a href="#" className="footer-link">Inicio</a>
                    <a href="#" className="footer-link">Iniciar sesión</a>
                    <a href="#" className="footer-link">Crear cuenta</a>
                </div>

                {/* Info */}
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

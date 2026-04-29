import React from 'react'
import { Button } from '../ui/button'

export const AuthSection = () => {
    return (

        <section className="landing-section-alt">
            <div className="landing-section-alt-container">

                <div className="landing-auth-visual">
                    <div className="auth-metric">
                        <span className="auth-metric-title">Cartas guardadas</span>
                        <span className="auth-metric-value">128</span>
                    </div>

                    <div className="auth-metric">
                        <span className="auth-metric-title">Usuarios</span>
                        <span className="auth-metric-value">24</span>
                    </div>

                    <div className="auth-panel">
                        Accede a estadísticas, filtros avanzados y
                        gestión completa de tu colección personal.
                    </div>
                </div>

                <div>
                    <h2 className="landing-section-alt-title">
                        Desbloquea todas las funcionalidades
                    </h2>

                    <p className="landing-section-alt-text">
                        Crea una cuenta para guardar tus cartas, personalizar tu perfil
                        y gestionar tu colección de Yu‑Gi‑Oh! desde un panel exclusivo.
                    </p>

                    <div className="landing-section-alt-cta">
                        <Button className="bg-orange-500 text-black hover:bg-orange-400">
                            Crear cuenta
                        </Button>

                        <Button variant="outline" className='text-black'>
                            Iniciar sesión
                        </Button>
                    </div>
                </div>

            </div>
        </section>

    )
}

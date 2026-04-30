
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'

export const Hero = () => {
    const navigate = useNavigate()

    return (
        <section className="hero-section">
            <div className="hero-bg" />
            <div className="hero-overlay" />
            <div className="hero-gradient-bottom" />

            <div className="relative z-10 max-w-3xl text-center">
                <h1 className="hero-title font-squealer reveal-on-scroll reveal-up is-visible">
                    AncientVault YGO
                </h1>

                <p className="hero-subtitle reveal-on-scroll reveal-up reveal-delay-1 is-visible">
                    Tu colección de cartas de Yu‑Gi‑Oh!, organizada en un solo lugar.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-4 reveal-on-scroll reveal-up reveal-delay-2 is-visible">
                    <Button
                        className="hero-cta-primary"
                        onClick={() => navigate("/register")}
                    >
                        Crear cuenta
                    </Button>

                    <Button
                        variant="outline"
                        className="text-black"
                        onClick={() => navigate("/login")}
                    >
                        Iniciar sesión
                    </Button>
                </div>
            </div>
        </section>
    )
}
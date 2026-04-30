import React from 'react'
import { Button } from '../ui/button'
import { supabase } from '../../lib/supabase'

export const Hero = () => {
    console.log(supabase);
    return (

        <section className="hero-section">

            <div className="hero-bg" />
            <div className="hero-overlay" />
            <div className="hero-gradient-bottom" />

            <div className="relative z-10 max-w-3xl text-center">
                <h1 className="hero-title font-squealer">
                    AncientVault YGO
                </h1>

                <p className="hero-subtitle">
                    Tu colección de cartas de Yu‑Gi‑Oh!, organizada en un solo lugar.
                </p>

                <div className="flex justify-center gap-4">
                    <Button className="hero-cta-primary">
                        Crear cuenta
                    </Button>

                    <Button variant="outline" className='text-black'>
                        Iniciar sesión
                    </Button>
                </div>
            </div>
        </section>

    )
}

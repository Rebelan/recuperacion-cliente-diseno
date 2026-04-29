import React from 'react'

export const CollectionSection = () => {
    return (

        <section className="landing-section">
            <div className="landing-section-container">

                {/* Text */}
                <div>
                    <h2 className="landing-section-title">
                        Organiza cada carta de tu colección
                    </h2>

                    <p className="landing-section-text">
                        Guarda, consulta y gestiona todas tus cartas de Yu‑Gi‑Oh! desde
                        una única plataforma diseñada para coleccionistas y duelistas.
                    </p>

                    <ul className="landing-section-list">
                        <li className="landing-section-list-item">
                            <span className="landing-section-bullet" />
                            Gestiona cartas
                        </li>
                        <li className="landing-section-list-item">
                            <span className="landing-section-bullet" />
                            Accede a tu colección desde cualquier dispositivo
                        </li>
                    </ul>
                </div>

                {/* Visual */}
                <div className="landing-section-visual">


                    <div className="card-mock">

                        <div
                            className="card-mock-image"
                        />

                        <div className="card-mock-overlay" />

                        <div className="card-mock-footer">
                            <div className="card-mock-title">
                                Blue‑Eyes White Dragon
                            </div>
                            <div className="card-mock-subtitle">
                                Dragón · ATK 3000 · DEF 2500
                            </div>
                        </div>

                    </div>
                </div>


                </div>
        </section>

    )
}

import React from 'react'

import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Link } from "react-router-dom"



export const Login = () => {
    return (

        <main className="min-h-screen bg-black flex items-center justify-center px-6">
            <Card className="w-full max-w-md bg-neutral-900 border-neutral-800">
                <CardHeader>
                    <CardTitle className="text-2xl text-white text-center">
                        Iniciar sesión
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <form className="space-y-6">

                        {/* Email */}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-neutral-300">
                                Correo electrónico
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="tu@email.com"
                                className="bg-neutral-800 border-neutral-700 text-white"
                            />
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-neutral-300">
                                Contraseña
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                className="bg-neutral-800 border-neutral-700 text-white"
                            />
                        </div>

                        {/* Submit */}
                        <Button
                            type="submit"
                            className="w-full bg-orange-500 text-black hover:bg-orange-400"
                        >
                            Iniciar sesión
                        </Button>
                    </form>

                    {/* Register link */}
                    <p className="mt-6 text-sm text-neutral-400 text-center">
                        ¿No tienes cuenta?{" "}
                        <Link
                            to="/register"
                            className="text-orange-500 hover:underline"
                        >
                            Crear cuenta
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </main>

    )
}

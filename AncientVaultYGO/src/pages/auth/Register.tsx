import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Label } from '../../components/ui/label'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import { Link } from 'react-router-dom'

export const Register = () => {
    return (
        <main className="min-h-screen bg-black flex items-center justify-center px-6">
            <Card className="w-full max-w-md bg-neutral-900 border-neutral-800">
                <CardHeader>
                    <CardTitle className="text-2xl text-white text-center">
                        Crear cuenta
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <form className="space-y-6">

                        <div className="space-y-2">
                            <Label htmlFor="username" className="text-neutral-300">
                                Nombre de usuario
                            </Label>
                            <Input
                                id="username"
                                type="text"
                                placeholder="tu_usuario"
                                className="bg-neutral-800 border-neutral-700 text-white"
                            />
                        </div>


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

                        <Button
                            type="submit"
                            className="w-full bg-orange-500 text-black hover:bg-orange-400"
                        >
                            Crear cuenta
                        </Button>
                    </form>


                    <p className="mt-6 text-sm text-neutral-400 text-center">
                        ¿Ya tienes cuenta?{" "}
                        <Link
                            to="/login"
                            className="text-orange-500 hover:underline"
                        >
                            Iniciar sesión
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </main>
    )
}

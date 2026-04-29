
import React, { useState } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Link, useNavigate } from "react-router-dom"
import { signIn } from '../../services/auth.service'

export default function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error } = await signIn(email, password)

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    navigate("/")
  }

  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-6">
      <Card className="w-full max-w-md bg-neutral-900 border-neutral-800">
        <CardHeader>
          <CardTitle className="text-2xl text-white text-center">
            Iniciar sesión
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-neutral-300">Correo electrónico</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-neutral-800 border-neutral-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-neutral-300">Contraseña</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-neutral-800 border-neutral-700 text-white"
              />
            </div>

            {error && (
              <p className="text-sm text-red-500 text-center">
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="w-full bg-orange-500 text-black hover:bg-orange-400"
              disabled={loading}
            >
              {loading ? "Entrando..." : "Iniciar sesión"}
            </Button>
          </form>

          <div className="mt-6 space-y-3 text-sm text-center">
            <p className="text-neutral-400">
              ¿No tienes cuenta?{" "}
              <Link to="/register" className="text-orange-500 hover:underline">
                Crear cuenta
              </Link>
            </p>

            <p>
              <Link to="/" className="text-neutral-400 hover:text-white hover:underline">
                Volver al inicio
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}

import { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"

import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { useAuthStore } from "../store/auth.store"
import { getProfileById } from "../services/profile.service"

import type { Profile as ProfileType } from "../types/profile"

export default function Profile() {
  const user = useAuthStore((state) => state.user)
  const loadingAuth = useAuthStore((state) => state.loading)

  const [profile, setProfile] = useState<ProfileType | null>(null)
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return

    setLoadingProfile(true)
    getProfileById(user.id)
      .then((data) => setProfile(data))
      .catch(() => setError("No se pudo cargar el perfil"))
      .finally(() => setLoadingProfile(false))
  }, [user])


  if (!loadingAuth && !user) {
    return <Navigate to="/login" replace />
  }

  if (loadingAuth || loadingProfile) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-neutral-400">Cargando perfil...</p>
      </main>
    )
  }

  if (error || !profile) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black px-6 py-24 flex justify-center">
      <Card className="w-full max-w-lg bg-neutral-900 border-neutral-800">
        <CardHeader>
          <CardTitle className="text-2xl text-white">
            Perfil de usuario
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 text-sm text-neutral-300">
          <div>
            <span className="text-neutral-400">Usuario</span>
            <p className="text-white font-medium">@{profile.username}</p>
          </div>

          <div>
            <span className="text-neutral-400">Email</span>
            <p className="text-white">{profile.email ?? "—"}</p>
          </div>

          <div>
            <span className="text-neutral-400">Bio</span>
            <p className="text-white">{profile.bio ?? "Sin descripción"}</p>
          </div>

          <div>
            <span className="text-neutral-400">Rol</span>
            <p className="text-white capitalize">{profile.role}</p>
          </div>

          <div>
            <span className="text-neutral-400">Miembro desde</span>
            <p className="text-white">
              {new Date(profile.created_at).toLocaleDateString()}
            </p>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
import { useEffect, useRef, useState } from "react"
import { Navigate } from "react-router-dom"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Textarea } from "../components/ui/textarea"
import { Badge } from "../components/ui/badge"

import { useAuthStore } from "../store/auth.store"
import {
  getProfileById,
  updateProfile,
  updateAvatar,
} from "../services/profile.service"
import { uploadAvatar } from "../services/avatar.service"

import type { Profile as ProfileType } from "../types/profile"

export default function Profile() {
  const user = useAuthStore((state) => state.user)
  const loadingAuth = useAuthStore((state) => state.loading)
  const setStoreProfile = useAuthStore((state) => state.setProfile)

  const [profile, setProfile] = useState<ProfileType | null>(null)
  const [username, setUsername] = useState("")
  const [bio, setBio] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (!user) return

    getProfileById(user.id)
      .then((data) => {
        setProfile(data)
        setStoreProfile(data)
        setUsername(data.username)
        setBio(data.bio ?? "")
      })
      .catch(() => setError("No se pudo cargar el perfil"))
  }, [user, setStoreProfile])

  if (!loadingAuth && !user) {
    return <Navigate to="/login" replace />
  }

  if (loadingAuth || !profile) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-neutral-400">Cargando perfil...</p>
      </main>
    )
  }

  const safeProfile = profile

  async function handleSave() {
    if (!user) return

    setSaving(true)
    setError(null)

    try {
      await updateProfile(user.id, { username, bio })

      const updatedProfile = {
        ...safeProfile,
        username,
        bio,
      }

      setProfile(updatedProfile)
      setStoreProfile(updatedProfile)
      setIsEditing(false)
    } catch {
      setError("Error al guardar los cambios")
    } finally {
      setSaving(false)
    }
  }

  function handleCancel() {
    setUsername(safeProfile.username)
    setBio(safeProfile.bio ?? "")
    setIsEditing(false)
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!user) return

    const file = e.target.files?.[0]
    if (!file) return

    setUploadingAvatar(true)
    setError(null)

    try {
      const publicUrl = await uploadAvatar(user.id, file)
      await updateAvatar(user.id, publicUrl)

      const updatedProfile = {
        ...safeProfile,
        avatar_url: publicUrl,
      }

      setProfile(updatedProfile)
      setStoreProfile(updatedProfile)
    } catch {
      setError("Error al subir el avatar")
    } finally {
      setUploadingAvatar(false)
    }
  }

  function openFilePicker() {
    fileInputRef.current?.click()
  }

  return (
    <main className="min-h-screen bg-black px-6 py-24 flex justify-center">
      <div className="w-full max-w-3xl space-y-8">

        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">
            Mi perfil
          </h1>

          {!isEditing && (
            <Button
              variant="outline"
              onClick={() => setIsEditing(true)}
            >
              Editar perfil
            </Button>
          )}
        </div>

        <Card className="bg-neutral-900 border-neutral-800">
          <CardHeader>
            <CardTitle className="text-white">
              Avatar
            </CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col items-center gap-4">
            {safeProfile.avatar_url ? (
              <img
                src={safeProfile.avatar_url}
                alt="Avatar del usuario"
                className="h-24 w-24 rounded-full object-cover border border-neutral-700"
              />
            ) : (
              <div className="h-24 w-24 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-2xl font-bold text-orange-400">
                {safeProfile.username.charAt(0).toUpperCase()}
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />

            <Button
              variant="outline"
              onClick={openFilePicker}
              disabled={uploadingAvatar}
            >
              {uploadingAvatar ? "Subiendo..." : "Cambiar avatar"}
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-800">
          <CardHeader>
            <CardTitle className="text-white">
              Información general
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 text-sm text-neutral-300">
            <div>
              <span className="text-neutral-400">Correo electrónico</span>
              <p className="text-white">{safeProfile.email ?? "—"}</p>
            </div>

            <div>
              <span className="text-neutral-400">Miembro desde</span>
              <p className="text-white">
                {new Date(safeProfile.created_at).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-800">
          <CardHeader>
            <CardTitle className="text-white">
              Datos del perfil
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label className="text-neutral-300">
                Nombre de usuario
              </Label>

              {isEditing ? (
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-neutral-800 border-neutral-700 text-white"
                />
              ) : (
                <p className="text-white">@{safeProfile.username}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-neutral-300">Biografía</Label>

              {isEditing ? (
                <Textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="bg-neutral-800 border-neutral-700 text-white"
                />
              ) : (
                <p className="text-white">
                  {safeProfile.bio ?? "Sin descripción"}
                </p>
              )}
            </div>

            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}

            {isEditing && (
              <div className="flex gap-3">
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-orange-500 text-black hover:bg-orange-400 flex-1"
                >
                  {saving ? "Guardando..." : "Guardar cambios"}
                </Button>

                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-800">
          <CardHeader>
            <CardTitle className="text-white">
              Rol
            </CardTitle>
          </CardHeader>

          <CardContent>
            <Badge
              className="bg-orange-500/10 text-orange-400 border border-orange-500/30"
              title="El rol determina los permisos dentro de la plataforma"
            >
              {safeProfile.role}
            </Badge>
          </CardContent>
        </Card>

      </div>
    </main>
  )
}

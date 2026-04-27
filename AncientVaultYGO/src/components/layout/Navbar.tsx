import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useAuthStore } from "../../store/auth.store"
import type { Profile } from "../../types/profile"
import { getProfileById } from "../../services/profile.service"
import { signOut } from "../../services/auth.service"
import { Button } from "../ui/button"

export const Navbar = () => {
  const user = useAuthStore((state) => state.user)
  const storeProfile = useAuthStore((state) => state.profile)
  const setStoreProfile = useAuthStore((state) => state.setProfile)
  const logoutStore = useAuthStore((state) => state.logout)

  const [profile, setProfile] = useState<Profile | null>(storeProfile)
  const [loadingProfile, setLoadingProfile] = useState(false)

  useEffect(() => {
    if (storeProfile) {
      setProfile(storeProfile)
    }
  }, [storeProfile])

  useEffect(() => {
    if (!user) {
      setProfile(null)
      return
    }

    if (storeProfile) return

    setLoadingProfile(true)

    getProfileById(user.id)
      .then((data) => {
        setProfile(data)
        setStoreProfile(data)
      })
      .catch(() => setProfile(null))
      .finally(() => setLoadingProfile(false))
  }, [user, storeProfile, setStoreProfile])

  const handleLogout = async () => {
    await signOut()
    logoutStore()
  }

  return (
    <header className="fixed top-0 z-50 w-full border-b border-neutral-800 bg-black/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-lg font-bold text-orange-500">
          AncientVault YGO
        </Link>

        <div className="flex items-center gap-4">
          {!user && (
            <>
              <Link to="/login">
                <Button variant="outline">
                  Iniciar sesión
                </Button>
              </Link>

              <Link to="/register">
                <Button className="bg-orange-500 text-black hover:bg-orange-400">
                  Crear cuenta
                </Button>
              </Link>
            </>
          )}

          {user && (
            <>
              <div className="flex items-center gap-3">
                <span className="text-sm text-white">
                  {loadingProfile ? "Cargando..." : `@${profile?.username}`}
                </span>

                <Link
                  to="/profile"
                  className="block transition hover:scale-105"
                  title="Ir al perfil"
                >
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt="Avatar del usuario"
                      className="h-8 w-8 rounded-full border border-neutral-700 object-cover hover:border-orange-400"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-700 bg-neutral-800 text-sm font-bold text-orange-400 hover:border-orange-400">
                      {profile?.username?.charAt(0).toUpperCase() ?? "U"}
                    </div>
                  )}
                </Link>
              </div>

              <Button
                variant="destructive"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

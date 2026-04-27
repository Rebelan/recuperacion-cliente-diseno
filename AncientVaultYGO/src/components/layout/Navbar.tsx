
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useAuthStore } from "../../store/auth.store"
import type { Profile } from "../../types/profile"
import { getProfileById } from "../../services/profile.service"
import { signOut } from "../../services/auth.service"
import { Button } from "../ui/button"



export const Navbar = () => {
  const user = useAuthStore((state) => state.user)
  const logoutStore = useAuthStore((state) => state.logout)

  const [profile, setProfile] = useState<Profile | null>(null)
  const [loadingProfile, setLoadingProfile] = useState(false)

  useEffect(() => {
    if (!user) {
      setProfile(null)
      return
    }

    setLoadingProfile(true)

    getProfileById(user.id)
      .then((data) => setProfile(data))
      .catch(() => setProfile(null))
      .finally(() => setLoadingProfile(false))
  }, [user])

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
              <span className="text-sm text-white">
                {loadingProfile ? "Cargando..." : `@${profile?.username}`}
              </span>

              <Link to="/profile">
                <Button variant="outline">
                  Perfil
                </Button>
              </Link>

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

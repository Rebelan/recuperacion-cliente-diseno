
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuthStore } from "../../store/auth.store"
import type { Profile } from "../../types/profile"
import { getProfileById } from "../../services/profile.service"
import { signOut } from "../../services/auth.service"
import { Button } from "../ui/button"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"

export const Navbar = () => {
  const user = useAuthStore((state) => state.user)
  const storeProfile = useAuthStore((state) => state.profile)
  const setStoreProfile = useAuthStore((state) => state.setProfile)
  const logoutStore = useAuthStore((state) => state.logout)

  const [profile, setProfile] = useState<Profile | null>(storeProfile)
  const [loadingProfile, setLoadingProfile] = useState(false)

  const navigate = useNavigate()

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
    navigate("/")
  }

  return (
    <header className="fixed top-0 z-50 w-full border-b border-neutral-800 bg-black/70 backdrop-blur">
      <div className="flex w-full items-center justify-center sm:justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="hidden sm:block text-lg font-bold text-orange-500">
          AncientVault YGO
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          {!user && (
            <>
              <Link to="/login">
                <Button
                  variant="outline"
                  className="h-9 px-3 text-sm sm:h-10 sm:px-4"
                >
                  Iniciar sesión
                </Button>
              </Link>

              <Link to="/register">
                <Button className="h-9 px-3 text-sm bg-orange-500 text-black hover:bg-orange-400 sm:h-10 sm:px-4">
                  Crear cuenta
                </Button>
              </Link>
            </>
          )}

          {user && (
            <>
              <div className="hidden sm:flex items-center gap-4">
                <Link to="/collection">
                  <Button variant="outline">Mi colección</Button>
                </Link>

                {profile?.role === "admin" && (
                  <Link to="/admin">
                    <Button variant="outline">Admin</Button>
                  </Link>
                )}
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="flex items-center justify-center sm:justify-start gap-0 sm:gap-3 rounded-full px-1 sm:px-2 py-1 transition hover:bg-neutral-900 focus:outline-none"
                    title="Menú de usuario"
                  >
                    <span className="hidden sm:block text-sm text-white">
                      {loadingProfile ? "Cargando..." : `@${profile?.username}`}
                    </span>

                    {profile?.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt="avatar"
                        className="h-9 w-9 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-700 bg-neutral-800 text-sm font-bold text-orange-400">
                        {profile?.username?.charAt(0).toUpperCase() ?? "U"}
                      </div>
                    )}
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-44 border-neutral-800 bg-neutral-950 text-white"
                >
                  <DropdownMenuItem asChild className="sm:hidden">
                    <Link to="/collection" className="cursor-pointer">
                      Mi colección
                    </Link>
                  </DropdownMenuItem>


                  {profile?.role === "admin" && (
                    <DropdownMenuItem asChild className="sm:hidden">
                      <Link to="/admin" className="cursor-pointer">
                        Admin
                      </Link>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      Ver perfil
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-red-500 focus:text-red-500"
                  >
                    Cerrar sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

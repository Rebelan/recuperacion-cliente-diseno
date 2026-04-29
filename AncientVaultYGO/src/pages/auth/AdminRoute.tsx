import { Navigate } from "react-router-dom"
import { useAuthStore } from "../../store/auth.store"

type AdminRouteProps = {
  children: React.ReactNode
}

export const AdminRoute = ({ children }: AdminRouteProps) => {
  const user = useAuthStore((state) => state.user)
  const profile = useAuthStore((state) => state.profile)
  const loading = useAuthStore((state) => state.loading)

  if (loading || (user && !profile)) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-neutral-400">Cargando...</p>
      </main>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!profile || profile.role !== "admin") {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
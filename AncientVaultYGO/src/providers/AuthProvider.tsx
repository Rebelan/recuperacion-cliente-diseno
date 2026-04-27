import { useEffect } from "react"
import { supabase } from "../lib/supabase"
import { useAuthStore } from "../store/auth.store"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setSession = useAuthStore((state) => state.setSession)
  const setLoading = useAuthStore((state) => state.setLoading)

  useEffect(() => {
    // Cargar sesión inicial
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
    })

    // Escuchar cambios de auth
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [setSession, setLoading])

  return <>{children}</>
}
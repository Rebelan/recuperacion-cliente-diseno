import { useEffect } from "react"
import { supabase } from "../lib/supabase"
import { useAuthStore } from "../store/auth.store"
import { getProfileById } from "../services/profile.service"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setSession = useAuthStore((state) => state.setSession)
  const setProfile = useAuthStore((state) => state.setProfile)
  const setLoading = useAuthStore((state) => state.setLoading)

  useEffect(() => {
    let isMounted = true

    async function hydrateAuth(session: Awaited<ReturnType<typeof supabase.auth.getSession>>["data"]["session"]) {
      if (!isMounted) return

      setLoading(true)
      setSession(session)

      if (session?.user) {
        try {
          const profile = await getProfileById(session.user.id)
          if (isMounted) {
            setProfile(profile)
          }
        } catch (error) {
          console.error("Error cargando profile:", error)
          if (isMounted) {
            setProfile(null)
          }
        }
      } else {
        setProfile(null)
      }

      if (isMounted) {
        setLoading(false)
      }
    }

    supabase.auth.getSession().then(({ data }) => {
      void hydrateAuth(data.session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      void hydrateAuth(session)
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [setSession, setProfile, setLoading])

  return <>{children}</>
}

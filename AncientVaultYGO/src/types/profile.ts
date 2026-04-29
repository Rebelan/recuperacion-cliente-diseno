
export type Profile = {
  id: string
  username: string
  email: string | null
  avatar_url: string | null
  bio: string | null
  role: "client" | "admin"
  is_active: boolean
  disabled_at: string | null
  created_at: string
  updated_at: string
}

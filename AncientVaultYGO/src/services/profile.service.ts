import { supabase } from "../lib/supabase"

export async function getProfileById(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single()

  if (error) {
    throw error
  }

  return data
}


export async function updateProfile(
  userId: string,
  data: { username?: string; bio?: string }
) {
  const { error } = await supabase
    .from("profiles")
    .update(data)
    .eq("id", userId)

  if (error) {
    throw error
  }
}


export async function updateAvatar(userId: string, avatarUrl: string) {
  const { error } = await supabase
    .from("profiles")
    .update({ avatar_url: avatarUrl })
    .eq("id", userId)

  if (error) {
    throw error
  }
}
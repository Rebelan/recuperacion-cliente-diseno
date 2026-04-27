
import { supabase } from "../lib/supabase"

export async function uploadAvatar(userId: string, file: File) {
  const fileExt = file.name.split(".").pop() || "png"
  const filePath = `${userId}/avatar.${fileExt}`

  const { error } = await supabase.storage
    .from("avatars")
    .upload(filePath, file, {
      upsert: true,
      cacheControl: "3600",
    })

  if (error) {
    throw error
  }

  const { data } = supabase.storage
    .from("avatars")
    .getPublicUrl(filePath)

  return data.publicUrl
}

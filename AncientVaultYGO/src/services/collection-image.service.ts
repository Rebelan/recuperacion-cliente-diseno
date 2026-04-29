import { supabase } from "../lib/supabase"

const BUCKET_NAME = "collection-cards"

export async function uploadCollectionCardImage(userId: string, file: File) {
  const fileExt = file.name.split(".").pop() || "png"
  const filePath = `${userId}/${crypto.randomUUID()}.${fileExt}`

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      upsert: false,
      cacheControl: "3600",
    })

  if (error) {
    throw error
  }

  return filePath
}

export function getCollectionCardImageUrl(imagePath: string | null) {
  if (!imagePath) {
    return "/images/reversoYugi.png"
  }

  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(imagePath)

  return data.publicUrl
}

export async function deleteCollectionCardImage(imagePath: string | null) {
  if (!imagePath) return

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([imagePath])

  if (error) {
    throw error
  }
}

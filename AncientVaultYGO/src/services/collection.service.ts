import { supabase } from "../lib/supabase"
import type { CollectionCard } from "../types/collection"

export async function getCollectionCardsByUser(userId: string) {
  const { data, error } = await supabase
    .from("collection_cards")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    throw error
  }

  return data as CollectionCard[]
}

export async function createCollectionCard(
  card: Omit<CollectionCard, "id" | "created_at" | "updated_at">
) {
  const { data, error } = await supabase
    .from("collection_cards")
    .insert(card)
    .select()
    .single()

  if (error) {
    throw error
  }

  return data as CollectionCard
}

export async function updateCollectionCard(
  cardId: string,
  updates: Partial<Omit<CollectionCard, "id" | "user_id" | "created_at" | "updated_at">>
) {
  const { data, error } = await supabase
    .from("collection_cards")
    .update(updates)
    .eq("id", cardId)
    .select()
    .single()

  if (error) {
    throw error
  }

  return data as CollectionCard
}

export async function deleteCollectionCard(cardId: string) {
  const { error } = await supabase
    .from("collection_cards")
    .delete()
    .eq("id", cardId)

  if (error) {
    throw error
  }
}

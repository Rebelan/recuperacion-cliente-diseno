import { supabase } from "../lib/supabase"
import type { Profile } from "../types/profile"

type MonthlyPoint = {
  label: string
  value: number
}

function groupByMonth(dates: string[]): MonthlyPoint[] {
  const map = new Map<string, number>()

  dates.forEach((dateString) => {
    const date = new Date(dateString)
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`

    map.set(key, (map.get(key) ?? 0) + 1)
  })

  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([label, value]) => ({ label, value }))
}

export async function getAdminDashboardStats() {
  const [{ count: usersCount, error: usersCountError }, { count: cardsCount, error: cardsCountError }] =
    await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("collection_cards").select("*", { count: "exact", head: true }),
    ])

  if (usersCountError) throw usersCountError
  if (cardsCountError) throw cardsCountError

  const [{ data: usersDates, error: usersDatesError }, { data: cardsDates, error: cardsDatesError }] =
    await Promise.all([
      supabase.from("profiles").select("created_at").order("created_at", { ascending: true }),
      supabase.from("collection_cards").select("created_at").order("created_at", { ascending: true }),
    ])

  if (usersDatesError) throw usersDatesError
  if (cardsDatesError) throw cardsDatesError

  return {
    usersCount: usersCount ?? 0,
    cardsCount: cardsCount ?? 0,
    usersOverTime: groupByMonth((usersDates ?? []).map((item) => item.created_at)),
    cardsOverTime: groupByMonth((cardsDates ?? []).map((item) => item.created_at)),
  }
}

export async function getAllProfiles() {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) throw error

  return data as Profile[]
}

export async function updateUsername(userId: string, username: string) {
  const { error } = await supabase
    .from("profiles")
    .update({ username })
    .eq("id", userId)

  if (error) throw error
}

export async function deleteUserAppData(userId: string) {
  const { error: cardsError } = await supabase
    .from("collection_cards")
    .delete()
    .eq("user_id", userId)

  if (cardsError) throw cardsError

  const { error: profileError } = await supabase
    .from("profiles")
    .delete()
    .eq("id", userId)

  if (profileError) throw profileError
}

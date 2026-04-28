export type CollectionCard = {
  id: string
  user_id: string
  name: string
  card_type: string
  monster_type: string | null
  attribute: string | null
  level: number | null
  atk: number | null
  def: number | null
  rarity: string | null
  archetype: string | null
  description: string | null
  image_path: string | null
  quantity: number
  is_favorite: boolean
  condition: string | null
  edition: string
  notes: string | null
  created_at: string
  updated_at: string
}
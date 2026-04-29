import { Input } from "../ui/input"

type CollectionFiltersProps = {
  search: string
  filterType: string
  filterRarity: string
  setSearch: (value: string) => void
  setFilterType: (value: string) => void
  setFilterRarity: (value: string) => void
  cardTypes: string[]
  rarities: string[]
}

export const CollectionFilters = ({
  search,
  filterType,
  filterRarity,
  setSearch,
  setFilterType,
  setFilterRarity,
  cardTypes,
  rarities,
}: CollectionFiltersProps) => {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar por nombre..."
        className="bg-neutral-900 border-neutral-800 text-white"
      />

      <select
        value={filterType}
        onChange={(e) => setFilterType(e.target.value)}
        className="h-10 rounded-md border border-neutral-800 bg-neutral-900 px-3 text-sm text-white outline-none"
      >
        <option value="">Todos los tipos</option>
        {cardTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>

      <select
        value={filterRarity}
        onChange={(e) => setFilterRarity(e.target.value)}
        className="h-10 rounded-md border border-neutral-800 bg-neutral-900 px-3 text-sm text-white outline-none"
      >
        <option value="">Todas las rarezas</option>
        {rarities.map((rarity) => (
          <option key={rarity} value={rarity}>
            {rarity}
          </option>
        ))}
      </select>
    </div>
  )
}
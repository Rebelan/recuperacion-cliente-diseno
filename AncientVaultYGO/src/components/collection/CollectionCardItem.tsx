import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card"
import { getCollectionCardImageUrl } from "../../services/collection-image.service"
import type { CollectionCard } from "../../types/collection"

type CollectionCardItemProps = {
  card: CollectionCard
}

export const CollectionCardItem = ({ card }: CollectionCardItemProps) => {
  const imageSrc = getCollectionCardImageUrl(card.image_path)

  return (
    <HoverCard openDelay={120}>
      <HoverCardTrigger asChild>
        <button
          type="button"
          className="group overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900 text-left transition hover:border-orange-500/40"
        >
          <div className="aspect-3/4 w-full overflow-hidden bg-black">
            <img
              src={imageSrc}
              alt={card.name}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
            />
          </div>

          <div className="border-t border-neutral-800 px-4 py-3">
            <h3 className="truncate text-sm font-semibold text-white">
              {card.name}
            </h3>
          </div>
        </button>
      </HoverCardTrigger>

      <HoverCardContent
        side="top"
        align="center"
        className="w-72 border-neutral-800 bg-neutral-950 text-white"
      >
        <div className="space-y-2 text-sm">
          <h4 className="font-semibold text-orange-400">{card.name}</h4>

          <p>
            <span className="text-neutral-400">Tipo:</span> {card.card_type}
          </p>

          {card.attribute && (
            <p>
              <span className="text-neutral-400">Atributo:</span> {card.attribute}
            </p>
          )}

          {card.atk !== null && (
            <p>
              <span className="text-neutral-400">ATK:</span> {card.atk}
            </p>
          )}

          {card.def !== null && (
            <p>
              <span className="text-neutral-400">DEF:</span> {card.def}
            </p>
          )}

          {card.rarity && (
            <p>
              <span className="text-neutral-400">Rareza:</span> {card.rarity}
            </p>
          )}

          {card.edition && (
            <p>
              <span className="text-neutral-400">Edición:</span> {card.edition}
            </p>
          )}

          {card.is_favorite && (
            <p className="font-medium text-orange-400">★ Favorita</p>
          )}

          {card.description && (
            <p className="pt-2 text-xs leading-relaxed text-neutral-300">
              {card.description}
            </p>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}

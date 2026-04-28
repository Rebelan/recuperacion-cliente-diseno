import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"

type CollectionCardFormFieldsProps = {
  name: string
  cardType: string
  rarity: string
  attribute: string
  atk: string
  def: string
  description: string
  imageFile: File | null

  setName: (value: string) => void
  setCardType: (value: string) => void
  setRarity: (value: string) => void
  setAttribute: (value: string) => void
  setAtk: (value: string) => void
  setDef: (value: string) => void
  setDescription: (value: string) => void
  setImageFile: (file: File | null) => void

  cardTypes: string[]
  rarities: string[]
  attributes: string[]
  showImageField?: boolean
}

export const CollectionCardFormFields = ({
  name,
  cardType,
  rarity,
  attribute,
  atk,
  def,
  description,
  imageFile,
  setName,
  setCardType,
  setRarity,
  setAttribute,
  setAtk,
  setDef,
  setDescription,
  setImageFile,
  cardTypes,
  rarities,
  attributes,
  showImageField = true,
}: CollectionCardFormFieldsProps) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2 sm:col-span-2">
        <Label className="text-neutral-300">Nombre</Label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-neutral-900 border-neutral-800 text-white"
          placeholder="Blue-Eyes White Dragon"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-neutral-300">Tipo de carta</Label>
        <select
          value={cardType}
          onChange={(e) => setCardType(e.target.value)}
          className="h-10 w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 text-sm text-white outline-none"
        >
          {cardTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label className="text-neutral-300">Rareza</Label>
        <select
          value={rarity}
          onChange={(e) => setRarity(e.target.value)}
          className="h-10 w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 text-sm text-white outline-none"
        >
          <option value="">Selecciona rareza</option>
          {rarities.map((rarityItem) => (
            <option key={rarityItem} value={rarityItem}>
              {rarityItem}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label className="text-neutral-300">Atributo</Label>
        <select
          value={attribute}
          onChange={(e) => setAttribute(e.target.value)}
          className="h-10 w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 text-sm text-white outline-none"
        >
          <option value="">Selecciona atributo</option>
          {attributes.map((attributeItem) => (
            <option key={attributeItem} value={attributeItem}>
              {attributeItem}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label className="text-neutral-300">ATK</Label>
        <Input
          type="number"
          value={atk}
          onChange={(e) => setAtk(e.target.value)}
          className="bg-neutral-900 border-neutral-800 text-white"
          placeholder="3000"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-neutral-300">DEF</Label>
        <Input
          type="number"
          value={def}
          onChange={(e) => setDef(e.target.value)}
          className="bg-neutral-900 border-neutral-800 text-white"
          placeholder="2500"
        />
      </div>

      {showImageField && (
        <div className="space-y-2 sm:col-span-2">
          <Label className="text-neutral-300">Imagen (opcional)</Label>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
            className="bg-neutral-900 border-neutral-800 text-white"
          />
          {imageFile && (
            <p className="text-xs text-neutral-400">
              Archivo seleccionado: {imageFile.name}
            </p>
          )}
        </div>
      )}

      <div className="space-y-2 sm:col-span-2">
        <Label className="text-neutral-300">Descripción</Label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="bg-neutral-900 border-neutral-800 text-white"
          placeholder="Descripción o notas visibles de la carta..."
        />
      </div>
    </div>
  )
}
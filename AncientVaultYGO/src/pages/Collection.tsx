import { useEffect, useMemo, useState } from "react"
import { Navigate } from "react-router-dom"

import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Textarea } from "../components/ui/textarea"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "../components/ui/dialog"

import { useAuthStore } from "../store/auth.store"
import {
    getCollectionCardsByUser,
    createCollectionCard,
} from "../services/collection.service"
import { uploadCollectionCardImage } from "../services/collection-image.service"
import { CollectionCardItem } from "../components/collection/CollectionCardItem"

import type { CollectionCard } from "../types/collection"

const CARD_TYPES = ["Monster", "Spell", "Trap"]

const RARITIES = [
    "Common",
    "Rare",
    "Super Rare",
    "Ultra Rare",
    "Secret Rare",
]

const ATTRIBUTES = [
    "DARK",
    "LIGHT",
    "EARTH",
    "WATER",
    "FIRE",
    "WIND",
    "DIVINE",
]

export default function Collection() {
    const user = useAuthStore((state) => state.user)
    const loadingAuth = useAuthStore((state) => state.loading)

    const [cards, setCards] = useState<CollectionCard[]>([])
    const [loadingCards, setLoadingCards] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    // Form
    const [name, setName] = useState("")
    const [cardType, setCardType] = useState("Monster")
    const [rarity, setRarity] = useState("")
    const [attribute, setAttribute] = useState("")
    const [atk, setAtk] = useState("")
    const [def, setDef] = useState("")
    const [description, setDescription] = useState("")
    const [imageFile, setImageFile] = useState<File | null>(null)

    
    const [search, setSearch] = useState("")
    const [filterType, setFilterType] = useState("")
    const [filterRarity, setFilterRarity] = useState("")

    useEffect(() => {
        if (!user) return

        setLoadingCards(true)
        setError(null)

        getCollectionCardsByUser(user.id)
            .then((data) => setCards(data))
            .catch(() => setError("No se pudo cargar la colección"))
            .finally(() => setLoadingCards(false))
    }, [user])

    const filteredCards = useMemo(() => {
        return cards.filter((card) => {
            const matchesName = card.name
                .toLowerCase()
                .includes(search.trim().toLowerCase())

            const matchesType = filterType ? card.card_type === filterType : true
            const matchesRarity = filterRarity ? card.rarity === filterRarity : true

            return matchesName && matchesType && matchesRarity
        })
    }, [cards, search, filterType, filterRarity])

    function resetForm() {
        setName("")
        setCardType("Monster")
        setRarity("")
        setAttribute("")
        setAtk("")
        setDef("")
        setDescription("")
        setImageFile(null)
    }

    async function handleCreateCard(e: React.FormEvent) {
        e.preventDefault()

        if (!user) return
        if (!name.trim()) {
            setError("El nombre de la carta es obligatorio")
            return
        }

        setSubmitting(true)
        setError(null)

        try {
            let imagePath: string | null = null

            if (imageFile) {
                imagePath = await uploadCollectionCardImage(user.id, imageFile)
            }

            const createdCard = await createCollectionCard({
                user_id: user.id,
                name: name.trim(),
                card_type: cardType,
                monster_type: null,
                attribute: attribute || null,
                level: null,
                atk: atk ? Number(atk) : null,
                def: def ? Number(def) : null,
                rarity: rarity || null,
                archetype: null,
                description: description.trim() || null,
                image_path: imagePath,
                quantity: 1,
                is_favorite: false,
                condition: null,
                edition: "standard",
                notes: null,
            })

            setCards((prev) => [createdCard, ...prev])
            resetForm()
            setIsAddDialogOpen(false)
        } catch (err) {
            console.error(err)
            setError("No se pudo crear la carta")
        } finally {
            setSubmitting(false)
        }
    }

    if (!loadingAuth && !user) {
        return <Navigate to="/login" replace />
    }

    if (loadingAuth || loadingCards) {
        return (
            <main className="min-h-screen bg-black flex items-center justify-center">
                <p className="text-neutral-400">Cargando colección...</p>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-black px-6 py-24 flex justify-center">
            <div className="w-full max-w-6xl space-y-8">
                {/* Header */}
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <h1 className="text-2xl font-bold text-white">Mi colección</h1>

                        <Button
                            onClick={() => setIsAddDialogOpen(true)}
                            className="bg-orange-500 text-black hover:bg-orange-400"
                        >
                            Añadir carta
                        </Button>
                    </div>

                    {/* Filters */}
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
                            {CARD_TYPES.map((type) => (
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
                            {RARITIES.map((rarityItem) => (
                                <option key={rarityItem} value={rarityItem}>
                                    {rarityItem}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Error */}
                {error && <p className="text-sm text-red-500">{error}</p>}

                {/* Empty state */}
                {!error && cards.length === 0 && (
                    <Card className="bg-neutral-900 border-neutral-800">
                        <CardHeader>
                            <CardTitle className="text-white">
                                Tu colección está vacía
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-3 text-neutral-300">
                            <p>Todavía no has añadido ninguna carta a tu colección.</p>
                            <p className="text-sm text-neutral-400">
                                Usa el botón <span className="text-orange-400">“Añadir carta”</span> para comenzar.
                            </p>
                        </CardContent>
                    </Card>
                )}

                {/* No results */}
                {!error && cards.length > 0 && filteredCards.length === 0 && (
                    <Card className="bg-neutral-900 border-neutral-800">
                        <CardContent className="py-6 text-neutral-300">
                            No se han encontrado cartas con esos filtros.
                        </CardContent>
                    </Card>
                )}

                {/* Grid */}
                {!error && filteredCards.length > 0 && (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredCards.map((card) => (
                            <CollectionCardItem key={card.id} card={card} />
                        ))}
                    </div>
                )}

                {/* Add card dialog */}
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogContent className="max-w-2xl border-neutral-800 bg-neutral-950 text-white">
                        <DialogHeader>
                            <DialogTitle>Añadir carta</DialogTitle>
                        </DialogHeader>

                        <form onSubmit={handleCreateCard} className="space-y-6">
                            <div className="grid gap-4 sm:grid-cols-2">
                                {/* Name */}
                                <div className="space-y-2 sm:col-span-2">
                                    <Label className="text-neutral-300">Nombre</Label>
                                    <Input
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="bg-neutral-900 border-neutral-800 text-white"
                                        placeholder="Blue-Eyes White Dragon"
                                    />
                                </div>

                                {/* Type */}
                                <div className="space-y-2">
                                    <Label className="text-neutral-300">Tipo de carta</Label>
                                    <select
                                        value={cardType}
                                        onChange={(e) => setCardType(e.target.value)}
                                        className="h-10 w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 text-sm text-white outline-none"
                                    >
                                        {CARD_TYPES.map((type) => (
                                            <option key={type} value={type}>
                                                {type}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Rarity */}
                                <div className="space-y-2">
                                    <Label className="text-neutral-300">Rareza</Label>
                                    <select
                                        value={rarity}
                                        onChange={(e) => setRarity(e.target.value)}
                                        className="h-10 w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 text-sm text-white outline-none"
                                    >
                                        <option value="">Selecciona rareza</option>
                                        {RARITIES.map((rarityItem) => (
                                            <option key={rarityItem} value={rarityItem}>
                                                {rarityItem}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Attribute */}
                                <div className="space-y-2">
                                    <Label className="text-neutral-300">Atributo</Label>
                                    <select
                                        value={attribute}
                                        onChange={(e) => setAttribute(e.target.value)}
                                        className="h-10 w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 text-sm text-white outline-none"
                                    >
                                        <option value="">Selecciona atributo</option>
                                        {ATTRIBUTES.map((attributeItem) => (
                                            <option key={attributeItem} value={attributeItem}>
                                                {attributeItem}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* ATK */}
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

                                {/* DEF */}
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

                                {/* Image */}
                                <div className="space-y-2 sm:col-span-2">
                                    <Label className="text-neutral-300">Imagen (opcional)</Label>
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                                        className="bg-neutral-900 border-neutral-800 text-white"
                                    />
                                </div>

                                {/* Description */}
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

                            <div className="flex gap-3">
                                <Button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 bg-orange-500 text-black hover:bg-orange-400"
                                >
                                    {submitting ? "Guardando..." : "Guardar carta"}
                                </Button>

                                <Button
                                    type="button"
                                    variant="outline"
                                    className="flex-1 text-black"
                                    onClick={() => {
                                        resetForm()
                                        setIsAddDialogOpen(false)
                                    }}
                                >
                                    Cancelar
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </main>
    )
}

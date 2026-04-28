import { useEffect, useMemo, useState } from "react"
import { Navigate } from "react-router-dom"

import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Label } from "../components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "../components/ui/dialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "../components/ui/alert-dialog"

import { useAuthStore } from "../store/auth.store"
import {
    getCollectionCardsByUser,
    createCollectionCard,
    updateCollectionCard,
    deleteCollectionCard,
} from "../services/collection.service"
import {
    uploadCollectionCardImage,
    deleteCollectionCardImage,
} from "../services/collection-image.service"

import { CollectionCardItem } from "../components/collection/CollectionCardItem"
import { CollectionFilters } from "../components/collection/CollectionFilters"
import { CollectionCardFormFields } from "../components/collection/CollectionCardFormFields"

import { CARD_TYPES, RARITIES, ATTRIBUTES } from "../constants/collectionOptions"

import type { CollectionCard } from "../types/collection"

export default function Collection() {
    const user = useAuthStore((state) => state.user)
    const loadingAuth = useAuthStore((state) => state.loading)

    const [cards, setCards] = useState<CollectionCard[]>([])
    const [loadingCards, setLoadingCards] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Dialog de crear
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [submittingCreate, setSubmittingCreate] = useState(false)

    // Dialog de detalle / edición
    const [selectedCard, setSelectedCard] = useState<CollectionCard | null>(null)
    const [isCardDialogOpen, setIsCardDialogOpen] = useState(false)
    const [isEditingCard, setIsEditingCard] = useState(false)
    const [submittingEdit, setSubmittingEdit] = useState(false)

    // Alert dialog de borrado
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [submittingDelete, setSubmittingDelete] = useState(false)

    // Formulario de crear
    const [name, setName] = useState("")
    const [cardType, setCardType] = useState("Monster")
    const [rarity, setRarity] = useState("")
    const [attribute, setAttribute] = useState("")
    const [atk, setAtk] = useState("")
    const [def, setDef] = useState("")
    const [description, setDescription] = useState("")
    const [imageFile, setImageFile] = useState<File | null>(null)

    // Formulario de editar
    const [editName, setEditName] = useState("")
    const [editCardType, setEditCardType] = useState("Monster")
    const [editRarity, setEditRarity] = useState("")
    const [editAttribute, setEditAttribute] = useState("")
    const [editAtk, setEditAtk] = useState("")
    const [editDef, setEditDef] = useState("")
    const [editDescription, setEditDescription] = useState("")
    const [editImageFile, setEditImageFile] = useState<File | null>(null)

    // Filtros
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

    function resetCreateForm() {
        setName("")
        setCardType("Monster")
        setRarity("")
        setAttribute("")
        setAtk("")
        setDef("")
        setDescription("")
        setImageFile(null)
    }

    function fillEditForm(card: CollectionCard) {
        setEditName(card.name)
        setEditCardType(card.card_type)
        setEditRarity(card.rarity ?? "")
        setEditAttribute(card.attribute ?? "")
        setEditAtk(card.atk !== null ? String(card.atk) : "")
        setEditDef(card.def !== null ? String(card.def) : "")
        setEditDescription(card.description ?? "")
        setEditImageFile(null)
    }

    function openCardDialog(card: CollectionCard) {
        setSelectedCard(card)
        fillEditForm(card)
        setIsEditingCard(false)
        setIsCardDialogOpen(true)
    }

    function closeCardDialog() {
        setSelectedCard(null)
        setIsEditingCard(false)
        setIsCardDialogOpen(false)
    }

    async function handleCreateCard(e: React.FormEvent) {
        e.preventDefault()

        if (!user) return
        if (!name.trim()) {
            setError("El nombre de la carta es obligatorio")
            return
        }

        setSubmittingCreate(true)
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
            resetCreateForm()
            setIsAddDialogOpen(false)
        } catch (err) {
            console.error(err)
            setError("No se pudo crear la carta")
        } finally {
            setSubmittingCreate(false)
        }
    }

    async function handleUpdateCard(e: React.FormEvent) {
        e.preventDefault()

        if (!selectedCard || !user) return
        if (!editName.trim()) {
            setError("El nombre de la carta es obligatorio")
            return
        }

        setSubmittingEdit(true)
        setError(null)

        try {
            let imagePath = selectedCard.image_path

            if (editImageFile) {
                imagePath = await uploadCollectionCardImage(user.id, editImageFile)
            }

            const updatedCard = await updateCollectionCard(selectedCard.id, {
                name: editName.trim(),
                card_type: editCardType,
                attribute: editAttribute || null,
                atk: editAtk ? Number(editAtk) : null,
                def: editDef ? Number(editDef) : null,
                rarity: editRarity || null,
                description: editDescription.trim() || null,
                image_path: imagePath,
            })

            setCards((prev) =>
                prev.map((card) => (card.id === updatedCard.id ? updatedCard : card))
            )

            setSelectedCard(updatedCard)
            fillEditForm(updatedCard)
            setIsEditingCard(false)
        } catch (err) {
            console.error(err)
            setError("No se pudo actualizar la carta")
        } finally {
            setSubmittingEdit(false)
        }
    }

    async function handleDeleteCard() {
        if (!selectedCard) return

        setSubmittingDelete(true)
        setError(null)

        try {
            if (selectedCard.image_path) {
                await deleteCollectionCardImage(selectedCard.image_path)
            }

            await deleteCollectionCard(selectedCard.id)

            setCards((prev) => prev.filter((card) => card.id !== selectedCard.id))
            setIsDeleteDialogOpen(false)
            closeCardDialog()
        } catch (err) {
            console.error(err)
            setError("No se pudo eliminar la carta")
        } finally {
            setSubmittingDelete(false)
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

                    <CollectionFilters
                        search={search}
                        filterType={filterType}
                        filterRarity={filterRarity}
                        setSearch={setSearch}
                        setFilterType={setFilterType}
                        setFilterRarity={setFilterRarity}
                        cardTypes={CARD_TYPES}
                        rarities={RARITIES}
                    />
                </div>

                {/* Error */}
                {error && <p className="text-sm text-red-500">{error}</p>}

                {/* Estado vacío */}
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

                {/* Sin resultados */}
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
                            <CollectionCardItem
                                key={card.id}
                                card={card}
                                onClick={() => openCardDialog(card)}
                            />
                        ))}
                    </div>
                )}

                {/* Dialog de crear */}
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogContent className="max-w-2xl border-neutral-800 bg-neutral-950 text-white max-h-[90vh] flex flex-col">
                        <DialogHeader>
                            <DialogTitle>Añadir carta</DialogTitle>
                        </DialogHeader>

                        <form onSubmit={handleCreateCard} className="flex flex-col flex-1 min-h-0">
                            <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-6">
                                <CollectionCardFormFields
                                    name={name}
                                    cardType={cardType}
                                    rarity={rarity}
                                    attribute={attribute}
                                    atk={atk}
                                    def={def}
                                    description={description}
                                    imageFile={imageFile}
                                    setName={setName}
                                    setCardType={setCardType}
                                    setRarity={setRarity}
                                    setAttribute={setAttribute}
                                    setAtk={setAtk}
                                    setDef={setDef}
                                    setDescription={setDescription}
                                    setImageFile={setImageFile}
                                    cardTypes={CARD_TYPES}
                                    rarities={RARITIES}
                                    attributes={ATTRIBUTES}
                                />
                            </div>
                            <div className="mt-4 flex gap-3">
                                <Button
                                    type="submit"
                                    disabled={submittingCreate}
                                    className="flex-1 bg-orange-500 text-black hover:bg-orange-400"
                                >
                                    {submittingCreate ? "Guardando..." : "Guardar carta"}
                                </Button>

                                <Button
                                    type="button"
                                    variant="outline"
                                    className="flex-1 text-black"
                                    onClick={() => {
                                        resetCreateForm()
                                        setIsAddDialogOpen(false)
                                    }}
                                >
                                    Cancelar
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Dialog de detalle / edición */}
                <Dialog
                    open={isCardDialogOpen}
                    onOpenChange={(open) => {
                        setIsCardDialogOpen(open)
                        if (!open) {
                            setIsEditingCard(false)
                        }
                    }}
                >
                    <DialogContent className="max-w-2xl border-neutral-800 bg-neutral-950 text-white">
                        <DialogHeader>
                            <DialogTitle>
                                {isEditingCard ? "Editar carta" : selectedCard?.name}
                            </DialogTitle>
                        </DialogHeader>

                        {selectedCard && !isEditingCard && (
                            <div className="space-y-6">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2 sm:col-span-2">
                                        <Label className="text-neutral-300">Nombre</Label>
                                        <p className="text-white">{selectedCard.name}</p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-neutral-300">Tipo de carta</Label>
                                        <p className="text-white">{selectedCard.card_type}</p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-neutral-300">Rareza</Label>
                                        <p className="text-white">{selectedCard.rarity ?? "—"}</p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-neutral-300">Atributo</Label>
                                        <p className="text-white">{selectedCard.attribute ?? "—"}</p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-neutral-300">ATK</Label>
                                        <p className="text-white">{selectedCard.atk ?? "—"}</p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-neutral-300">DEF</Label>
                                        <p className="text-white">{selectedCard.def ?? "—"}</p>
                                    </div>

                                    <div className="space-y-2 sm:col-span-2">
                                        <Label className="text-neutral-300">Descripción</Label>
                                        <p className="text-white">
                                            {selectedCard.description ?? "Sin descripción"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <Button
                                        type="button"
                                        className="flex-1 bg-orange-500 text-black hover:bg-orange-400"
                                        onClick={() => setIsEditingCard(true)}
                                    >
                                        Editar
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="destructive"
                                        className="flex-1"
                                        onClick={() => setIsDeleteDialogOpen(true)}
                                    >
                                        Eliminar
                                    </Button>
                                </div>
                            </div>
                        )}

                        {selectedCard && isEditingCard && (
                            <form onSubmit={handleUpdateCard} className="space-y-6">
                                <CollectionCardFormFields
                                    name={editName}
                                    cardType={editCardType}
                                    rarity={editRarity}
                                    attribute={editAttribute}
                                    atk={editAtk}
                                    def={editDef}
                                    description={editDescription}
                                    imageFile={editImageFile}
                                    setName={setEditName}
                                    setCardType={setEditCardType}
                                    setRarity={setEditRarity}
                                    setAttribute={setEditAttribute}
                                    setAtk={setEditAtk}
                                    setDef={setEditDef}
                                    setDescription={setEditDescription}
                                    setImageFile={setEditImageFile}
                                    cardTypes={CARD_TYPES}
                                    rarities={RARITIES}
                                    attributes={ATTRIBUTES}
                                />

                                <div className="flex gap-3">
                                    <Button
                                        type="submit"
                                        disabled={submittingEdit}
                                        className="flex-1 bg-orange-500 text-black hover:bg-orange-400"
                                    >
                                        {submittingEdit ? "Guardando..." : "Guardar cambios"}
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="flex-1 text-black"
                                        onClick={() => {
                                            fillEditForm(selectedCard)
                                            setIsEditingCard(false)
                                        }}
                                    >
                                        Cancelar
                                    </Button>
                                </div>
                            </form>
                        )}
                    </DialogContent>
                </Dialog>

                {/* Confirmación de borrado */}
                <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <AlertDialogContent className="border-neutral-800 bg-neutral-950 text-white">
                        <AlertDialogHeader>
                            <AlertDialogTitle>¿Eliminar carta?</AlertDialogTitle>
                            <AlertDialogDescription className="text-neutral-400">
                                Esta acción eliminará la carta de tu colección y no se puede deshacer.
                            </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter>
                            <AlertDialogCancel className="border-neutral-800 bg-transparent text-white">
                                Cancelar
                            </AlertDialogCancel>

                            <AlertDialogAction
                                onClick={handleDeleteCard}
                                className="bg-red-600 text-white hover:bg-red-500"
                            >
                                {submittingDelete ? "Eliminando..." : "Sí, eliminar"}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </main>
    )
}
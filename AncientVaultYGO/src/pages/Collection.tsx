import { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"

import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"

import { useAuthStore } from "../store/auth.store"
import { getCollectionCardsByUser } from "../services/collection.service"

import type { CollectionCard } from "../types/collection"

export default function Collection() {
  const user = useAuthStore((state) => state.user)
  const loadingAuth = useAuthStore((state) => state.loading)

  const [cards, setCards] = useState<CollectionCard[]>([])
  const [loadingCards, setLoadingCards] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return

    setLoadingCards(true)
    setError(null)

    getCollectionCardsByUser(user.id)
      .then((data) => setCards(data))
      .catch(() => setError("No se pudo cargar la colección"))
      .finally(() => setLoadingCards(false))
  }, [user])

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
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Mi colección</h1>

          <Button className="bg-orange-500 text-black hover:bg-orange-400">
            Añadir carta
          </Button>
        </div>

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        {!error && cards.length === 0 && (
          <Card className="bg-neutral-900 border-neutral-800">
            <CardHeader>
              <CardTitle className="text-white">
                Tu colección está vacía
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3 text-neutral-300">
              <p>
                Todavía no has añadido ninguna carta a tu colección.
              </p>
              <p className="text-sm text-neutral-400">
                Cuando quieras, podrás añadir una carta usando el botón superior.
              </p>
            </CardContent>
          </Card>
        )}

        {!error && cards.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((card) => (
              <Card
                key={card.id}
                className="bg-neutral-900 border-neutral-800"
              >
                <CardHeader>
                  <CardTitle className="text-white text-lg">
                    {card.name}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-2 text-sm text-neutral-300">
                  <p>
                    <span className="text-neutral-400">Tipo:</span>{" "}
                    {card.card_type}
                  </p>

                  <p>
                    <span className="text-neutral-400">Cantidad:</span>{" "}
                    {card.quantity}
                  </p>

                  <p>
                    <span className="text-neutral-400">Edición:</span>{" "}
                    {card.edition}
                  </p>

                  {card.is_favorite && (
                    <p className="text-orange-400 font-medium">
                      ★ Favorita
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

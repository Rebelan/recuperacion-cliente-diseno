import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog"

import {
  getAllProfiles,
  updateUsername,
  deleteUserAppData,
} from "../../services/admin.service"
import type { Profile } from "../../types/profile"

export default function AdminUsers() {
  const [users, setUsers] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [selectedUser, setSelectedUser] = useState<Profile | null>(null)

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const [editUsername, setEditUsername] = useState("")
  const [submittingEdit, setSubmittingEdit] = useState(false)
  const [submittingDelete, setSubmittingDelete] = useState(false)

  useEffect(() => {
    getAllProfiles()
      .then((data) => setUsers(data))
      .catch(() => setError("No se pudo cargar la gestión de usuarios"))
      .finally(() => setLoading(false))
  }, [])

  function openEditDialog(user: Profile) {
    setSelectedUser(user)
    setEditUsername(user.username)
    setIsEditDialogOpen(true)
  }

  function openDeleteDialog(user: Profile) {
    setSelectedUser(user)
    setIsDeleteDialogOpen(true)
  }

  async function handleSaveUsername(e: React.FormEvent) {
    e.preventDefault()

    if (!selectedUser) return
    if (!editUsername.trim()) {
      setError("El nombre de usuario no puede estar vacío")
      return
    }

    setSubmittingEdit(true)
    setError(null)

    try {
      await updateUsername(selectedUser.id, editUsername.trim())

      setUsers((prev) =>
        prev.map((user) =>
          user.id === selectedUser.id
            ? { ...user, username: editUsername.trim() }
            : user
        )
      )

      setIsEditDialogOpen(false)
      setSelectedUser(null)
      setEditUsername("")
    } catch (err) {
      console.error(err)
      setError("No se pudo actualizar el nombre de usuario")
    } finally {
      setSubmittingEdit(false)
    }
  }

  async function handleDeleteUser() {
    if (!selectedUser) return

    setSubmittingDelete(true)
    setError(null)

    try {
      await deleteUserAppData(selectedUser.id)

      setUsers((prev) => prev.filter((user) => user.id !== selectedUser.id))

      setIsDeleteDialogOpen(false)
      setSelectedUser(null)
    } catch (err) {
      console.error(err)
      setError("No se pudo eliminar el usuario")
    } finally {
      setSubmittingDelete(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-neutral-400">Cargando usuarios...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black px-6 py-24 flex justify-center">
      <div className="w-full max-w-7xl space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-white">Gestión de usuarios</h1>

          <Link to="/admin">
            <Button variant="outline">Volver al dashboard</Button>
          </Link>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <Card className="bg-neutral-900 border-neutral-800">
          <CardHeader>
            <CardTitle className="text-white">Usuarios</CardTitle>
          </CardHeader>

          <CardContent className="overflow-x-auto">
            <table className="w-full text-sm text-left text-neutral-300">
              <thead className="border-b border-neutral-800 text-neutral-400">
                <tr>
                  <th className="py-3 pr-4">Usuario</th>
                  <th className="py-3 pr-4">Email</th>
                  <th className="py-3 pr-4">Rol</th>
                  <th className="py-3 pr-4">Registro</th>
                  <th className="py-3">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-neutral-800">
                    <td className="py-3 pr-4 text-white">@{user.username}</td>
                    <td className="py-3 pr-4">{user.email ?? "—"}</td>
                    <td className="py-3 pr-4">{user.role}</td>
                    <td className="py-3 pr-4">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3">
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-black"
                          onClick={() => openEditDialog(user)}
                        >
                          Editar nombre
                        </Button>

                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => openDeleteDialog(user)}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Modal editar username */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-md border-neutral-800 bg-neutral-950 text-white">
            <DialogHeader>
              <DialogTitle>Editar nombre de usuario</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSaveUsername} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-neutral-300">Nombre de usuario</Label>
                <Input
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  className="bg-neutral-900 border-neutral-800 text-white"
                  placeholder="Nuevo nombre de usuario"
                />
              </div>

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
                  className="flex-1"
                  onClick={() => {
                    setIsEditDialogOpen(false)
                    setSelectedUser(null)
                    setEditUsername("")
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Confirmación de borrado */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent className="border-neutral-800 bg-neutral-950 text-white">
            <AlertDialogHeader>
              <AlertDialogTitle>¿Eliminar usuario?</AlertDialogTitle>
              <AlertDialogDescription className="text-neutral-400">
                Se eliminarán sus cartas y su perfil de la aplicación. Esta acción no se puede deshacer.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel className="border-neutral-800 bg-transparent text-white">
                Cancelar
              </AlertDialogCancel>

              <AlertDialogAction
                onClick={handleDeleteUser}
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

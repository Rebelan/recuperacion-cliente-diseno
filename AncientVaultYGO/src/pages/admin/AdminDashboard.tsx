import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
} from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { getAdminDashboardStats } from "../../services/admin.service"

type DashboardStats = {
  usersCount: number
  cardsCount: number
  usersOverTime: { label: string; value: number }[]
  cardsOverTime: { label: string; value: number }[]
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getAdminDashboardStats()
      .then((data) => setStats(data))
      .catch(() => setError("No se pudo cargar el dashboard"))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-neutral-400">Cargando dashboard...</p>
      </main>
    )
  }

  if (error || !stats) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-red-500">{error ?? "Error inesperado"}</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black px-6 py-24 flex justify-center">
      <div className="w-full max-w-7xl space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-white">Panel de administración</h1>

          <Link to="/admin/users">
            <Button variant="outline">Gestionar usuarios</Button>
          </Link>
        </div>

        {/* KPI cards */}
        <div className="grid gap-6 sm:grid-cols-2">
          <Card className="bg-neutral-900 border-neutral-800">
            <CardHeader>
              <CardTitle className="text-white">Usuarios registrados</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-orange-400">{stats.usersCount}</p>
            </CardContent>
          </Card>

          <Card className="bg-neutral-900 border-neutral-800">
            <CardHeader>
              <CardTitle className="text-white">Cartas creadas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-orange-400">{stats.cardsCount}</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="bg-neutral-900 border-neutral-800">
            <CardHeader>
              <CardTitle className="text-white">Usuarios registrados por mes</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.usersOverTime}>
                  <CartesianGrid stroke="#262626" />
                  <XAxis dataKey="label" stroke="#a3a3a3" />
                  <YAxis stroke="#a3a3a3" />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#f97316" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-neutral-900 border-neutral-800">
            <CardHeader>
              <CardTitle className="text-white">Cartas creadas por mes</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.cardsOverTime}>
                  <CartesianGrid stroke="#262626" />
                  <XAxis dataKey="label" stroke="#a3a3a3" />
                  <YAxis stroke="#a3a3a3" />
                  <Tooltip />
                  <Bar dataKey="value" fill="#f97316" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}

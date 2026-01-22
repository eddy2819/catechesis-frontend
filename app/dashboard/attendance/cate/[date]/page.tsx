"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { dataStore } from "@/lib/store"
import type { Catechist, CatechistAttendance } from "@/lib/types"
import { AlertCircle, ArrowLeft, CheckCircle2, Save, XCircle } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function CatechistAttendancePage() {
  const params = useParams()
  const router = useRouter()
  const dateStr = params.date as string
  const eventDate = new Date(dateStr)

  const [catechists, setCatechists] = useState<Catechist[]>([])
  const [attendanceRecords, setAttendanceRecords] = useState<
    Record<string, { status: CatechistAttendance["status"]; notes: string }>
  >({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = () => {
      const allCatechists = dataStore.getCatechists().filter((c) => c.status === "active")
      setCatechists(allCatechists)

      const existingAttendance = dataStore.getCatechistAttendancesByDate(eventDate)
      const records: Record<string, { status: CatechistAttendance["status"]; notes: string }> = {}

      allCatechists.forEach((catechist) => {
        const existing = existingAttendance.find((a) => a.catechistId === catechist.id)
        records[catechist.id] = {
          status: existing?.status || "present",
          notes: existing?.notes || "",
        }
      })

      setAttendanceRecords(records)
      setLoading(false)
    }

    loadData()
  }, [dateStr])

  const updateAttendance = (catechistId: string, field: "status" | "notes", value: string) => {
    setAttendanceRecords((prev) => ({
      ...prev,
      [catechistId]: {
        ...prev[catechistId],
        [field]: value,
      },
    }))
  }

  const handleSave = () => {
    catechists.forEach((catechist) => {
      const record = attendanceRecords[catechist.id]
      const existing = dataStore.getCatechistAttendanceByCatechistAndDate(catechist.id, eventDate)

      if (existing) {
        dataStore.updateCatechistAttendance(existing.id, {
          status: record.status,
          notes: record.notes,
        })
      } else {
        dataStore.addCatechistAttendance({
          catechistId: catechist.id,
          eventDate,
          status: record.status,
          notes: record.notes,
        })
      }
    })

    router.push("/dashboard/attendance")
  }

  const stats = {
    present: Object.values(attendanceRecords).filter((r) => r.status === "present").length,
    absent: Object.values(attendanceRecords).filter((r) => r.status === "absent").length,
    excused: Object.values(attendanceRecords).filter((r) => r.status === "excused").length,
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-amber-600">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/attendance">
          <Button variant="outline" size="icon" className="border-amber-300 bg-transparent">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-amber-900">Asistencia de Catequistas</h1>
          <p className="text-amber-700 mt-1 capitalize">{formatDate(eventDate)}</p>
        </div>
        <Button onClick={handleSave} className="bg-amber-600 hover:bg-amber-700">
          <Save className="w-4 h-4 mr-2" />
          Guardar Asistencias
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-green-700">
              <CheckCircle2 className="w-5 h-5" />
              Presentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-700">{stats.present}</div>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-red-700">
              <XCircle className="w-5 h-5" />
              Ausentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-700">{stats.absent}</div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-blue-700">
              <AlertCircle className="w-5 h-5" />
              Justificados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-700">{stats.excused}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-amber-200">
        <CardHeader>
          <CardTitle className="text-amber-900">Lista de Catequistas</CardTitle>
          <CardDescription>
            Marca la asistencia de cada catequista al evento ({catechists.length} catequistas activos)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {catechists.map((catechist) => (
              <div key={catechist.id} className="border border-amber-200 rounded-lg p-4 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                  <div className="md:col-span-3">
                    <div className="font-semibold text-amber-900">
                      {catechist.firstName} {catechist.lastName}
                    </div>
                    <div className="text-sm text-amber-600 capitalize">{catechist.role}</div>
                    {catechist.neighborhood && <div className="text-sm text-amber-600">{catechist.neighborhood}</div>}
                  </div>

                  <div className="md:col-span-3">
                    <label className="text-sm font-medium text-amber-900 block mb-2">Estado</label>
                    <select
                      value={attendanceRecords[catechist.id]?.status || "present"}
                      onChange={(e) =>
                        updateAttendance(catechist.id, "status", e.target.value as CatechistAttendance["status"])
                      }
                      className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="present">Presente</option>
                      <option value="absent">Ausente</option>
                      <option value="excused">Justificado</option>
                    </select>
                  </div>

                  <div className="md:col-span-6">
                    <label className="text-sm font-medium text-amber-900 block mb-2">Notas (opcional)</label>
                    <input
                      type="text"
                      value={attendanceRecords[catechist.id]?.notes || ""}
                      onChange={(e) => updateAttendance(catechist.id, "notes", e.target.value)}
                      placeholder="Agregar observaciones..."
                      className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </div>
            ))}

            {catechists.length === 0 && (
              <div className="text-center py-12 text-amber-600">
                <p>No hay catequistas activos registrados.</p>
                <Link href="/dashboard/catechists/new">
                  <Button className="mt-4 bg-amber-600 hover:bg-amber-700">Agregar Catequista</Button>
                </Link>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Save, Check, X, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { dataStore } from "@/lib/store"
import type { Parent, ParentAttendance } from "@/lib/types"

export default function ParentAttendancePage() {
  const router = useRouter()
  const params = useParams()
  const dateStr = params.date as string
  const selectedDate = new Date(dateStr)

  const [parents, setParents] = useState<Parent[]>([])
  const [attendanceRecords, setAttendanceRecords] = useState<Map<string, ParentAttendance>>(new Map())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const allParents = dataStore.getParents()
    setParents(allParents)

    const existingAttendance = dataStore.getParentAttendancesByDate(selectedDate)
    const recordsMap = new Map<string, ParentAttendance>()
    existingAttendance.forEach((record) => {
      recordsMap.set(record.parentId, record)
    })
    setAttendanceRecords(recordsMap)
    setLoading(false)
  }, [dateStr])

  const handleStatusChange = (parentId: string, status: ParentAttendance["status"]) => {
    const existing = attendanceRecords.get(parentId)
    if (existing) {
      const updated = dataStore.updateParentAttendance(existing.id, { status })
      if (updated) {
        const newMap = new Map(attendanceRecords)
        newMap.set(parentId, updated)
        setAttendanceRecords(newMap)
      }
    } else {
      const newRecord = dataStore.addParentAttendance({
        parentId,
        meetingDate: selectedDate,
        status,
      })
      const newMap = new Map(attendanceRecords)
      newMap.set(parentId, newRecord)
      setAttendanceRecords(newMap)
    }
  }

  const handleNotesChange = (parentId: string, notes: string) => {
    const existing = attendanceRecords.get(parentId)
    if (existing) {
      const updated = dataStore.updateParentAttendance(existing.id, { notes })
      if (updated) {
        const newMap = new Map(attendanceRecords)
        newMap.set(parentId, updated)
        setAttendanceRecords(newMap)
      }
    }
  }

  const getStatusColor = (status: ParentAttendance["status"]) => {
    switch (status) {
      case "present":
        return "bg-green-100 text-green-800 border-green-300"
      case "absent":
        return "bg-red-100 text-red-800 border-red-300"
      case "excused":
        return "bg-blue-100 text-blue-800 border-blue-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  const getStatusIcon = (status: ParentAttendance["status"]) => {
    switch (status) {
      case "present":
        return <Check className="w-4 h-4" />
      case "absent":
        return <X className="w-4 h-4" />
      case "excused":
        return <AlertCircle className="w-4 h-4" />
      default:
        return null
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  const getStudentNames = (studentIds: string[]) => {
    return studentIds
      .map((id) => {
        const student = dataStore.getStudentById(id)
        return student ? `${student.firstName} ${student.lastName}` : ""
      })
      .filter(Boolean)
      .join(", ")
  }

  const stats = {
    present: Array.from(attendanceRecords.values()).filter((r) => r.status === "present").length,
    absent: Array.from(attendanceRecords.values()).filter((r) => r.status === "absent").length,
    excused: Array.from(attendanceRecords.values()).filter((r) => r.status === "excused").length,
  }

  if (loading) {
    return <div className="text-amber-900">Cargando...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/attendance">
          <Button variant="ghost" size="icon" className="text-amber-900 hover:bg-amber-100">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-amber-900">Asistencia de Padres a Reunión</h1>
          <p className="text-amber-700 mt-1 capitalize">{formatDate(selectedDate)}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="border-green-300 bg-green-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-green-900">Presentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{stats.present}</div>
          </CardContent>
        </Card>
        <Card className="border-red-300 bg-red-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-red-900">Ausentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900">{stats.absent}</div>
          </CardContent>
        </Card>
        <Card className="border-blue-300 bg-blue-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-blue-900">Justificados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{stats.excused}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-amber-200">
        <CardHeader>
          <CardTitle className="text-amber-900">Lista de Padres</CardTitle>
          <CardDescription>Marca la asistencia de cada padre o tutor a la reunión</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {parents.map((parent) => {
              const record = attendanceRecords.get(parent.id)
              const status = record?.status

              return (
                <div key={parent.id} className="border border-amber-200 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-amber-900">
                        {parent.firstName} {parent.lastName}
                      </h3>
                      <p className="text-sm text-amber-700 capitalize">{parent.relationship}</p>
                      {parent.studentIds.length > 0 && (
                        <p className="text-xs text-amber-600 mt-1">Hijos: {getStudentNames(parent.studentIds)}</p>
                      )}
                    </div>
                    {status && (
                      <div
                        className={`px-3 py-1 rounded-full border flex items-center gap-2 ${getStatusColor(status)}`}
                      >
                        {getStatusIcon(status)}
                        <span className="text-sm font-medium capitalize">
                          {status === "present" ? "Presente" : status === "absent" ? "Ausente" : "Justificado"}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={status === "present" ? "default" : "outline"}
                      className={
                        status === "present"
                          ? "bg-green-600 hover:bg-green-700"
                          : "border-green-300 text-green-700 hover:bg-green-50"
                      }
                      onClick={() => handleStatusChange(parent.id, "present")}
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Presente
                    </Button>
                    <Button
                      size="sm"
                      variant={status === "absent" ? "default" : "outline"}
                      className={
                        status === "absent"
                          ? "bg-red-600 hover:bg-red-700"
                          : "border-red-300 text-red-700 hover:bg-red-50"
                      }
                      onClick={() => handleStatusChange(parent.id, "absent")}
                    >
                      <X className="w-4 h-4 mr-1" />
                      Ausente
                    </Button>
                    <Button
                      size="sm"
                      variant={status === "excused" ? "default" : "outline"}
                      className={
                        status === "excused"
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "border-blue-300 text-blue-700 hover:bg-blue-50"
                      }
                      onClick={() => handleStatusChange(parent.id, "excused")}
                    >
                      <AlertCircle className="w-4 h-4 mr-1" />
                      Justificado
                    </Button>
                  </div>

                  {record && (
                    <div>
                      <label className="text-sm font-medium text-amber-900 mb-1 block">Notas</label>
                      <input
                        type="text"
                        placeholder="Agregar notas opcionales..."
                        value={record.notes || ""}
                        onChange={(e) => handleNotesChange(parent.id, e.target.value)}
                        className="w-full px-3 py-2 border border-amber-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Link href="/dashboard/attendance">
          <Button className="bg-amber-600 hover:bg-amber-700">
            <Save className="w-4 h-4 mr-2" />
            Guardar y Volver
          </Button>
        </Link>
      </div>
    </div>
  )
}

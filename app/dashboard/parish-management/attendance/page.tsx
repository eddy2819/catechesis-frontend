"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { dataStore } from "@/lib/store"
import type { Student } from "@/lib/types"
import { AlertCircle, ArrowLeft, CheckCircle2, Clock, Save, XCircle } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

type AttendanceStatus = "presente" | "ausente" | "tarde" | "justificado"

export default function ParishAttendancePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const level = searchParams.get("level") || ""
  const neighborhood = searchParams.get("neighborhood") || ""

  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [students, setStudents] = useState<Student[]>([])
  const [attendanceRecords, setAttendanceRecords] = useState<
    Map<
      string,
      {
        status: AttendanceStatus
        notes: string
      }
    >
  >(new Map())

  useEffect(() => {
    const filters: any = {}
    if (level) filters.level = level
    if (neighborhood) filters.neighborhood = neighborhood

    const filteredStudents = dataStore.getStudentsByFilters(filters)
    setStudents(filteredStudents)

    // Load existing attendance for this date
    const selectedDate = new Date(date)
    const existingAttendance = dataStore.getAttendancesByDate(selectedDate)

    const records = new Map()
    filteredStudents.forEach((student) => {
                      const existing = existingAttendance.find((a) => a.studentId === student.id)
      records.set(student.id, {
        status: existing?.status || "presente",
        notes: existing?.notes || "",
      })
    })
    setAttendanceRecords(records)
  }, [level, neighborhood, date])

  const updateAttendance = (studentId: string, status: AttendanceStatus) => {
    const current = attendanceRecords.get(studentId) || { status: "presente", notes: "" }
    setAttendanceRecords(new Map(attendanceRecords.set(studentId, { ...current, status })))
  }

  const updateNotes = (studentId: string, notes: string) => {
    const current = attendanceRecords.get(studentId) || { status: "presente", notes: "" }
    setAttendanceRecords(new Map(attendanceRecords.set(studentId, { ...current, notes })))
  }

  const handleSave = () => {
    const selectedDate = new Date(date)

    // Delete existing attendance for this date and these students
    students.forEach((student) => {
      const existing = dataStore.getAttendanceByStudentAndDate(student.id, selectedDate)
      if (existing) {
        dataStore.deleteAttendance(existing.id)
      }
    })

    // Save new attendance records
    students.forEach((student) => {
      const record = attendanceRecords.get(student.id)
      if (record) {
        dataStore.addAttendance({
          studentId: student.id,
          date: selectedDate,
          status: record.status,
          notes: record.notes || undefined,
        })
      }
    })

    alert("Asistencia guardada exitosamente")
    router.push("/dashboard/parish-management")
  }

  const getStatusIcon = (status: AttendanceStatus) => {
    switch (status) {
      case "presente":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />
      case "ausente":
        return <XCircle className="h-5 w-5 text-red-600" />
      case "tarde":
        return <Clock className="h-5 w-5 text-orange-600" />
      case "justificado":
        return <AlertCircle className="h-5 w-5 text-blue-600" />
    }
  }

  const getStatusColor = (status: AttendanceStatus) => {
    switch (status) {
      case "presente":
        return "bg-green-100 hover:bg-green-200 border-green-300 text-green-900"
      case "ausente":
        return "bg-red-100 hover:bg-red-200 border-red-300 text-red-900"
      case "tarde":
        return "bg-orange-100 hover:bg-orange-200 border-orange-300 text-orange-900"
      case "justificado":
        return "bg-blue-100 hover:bg-blue-200 border-blue-300 text-blue-900"
    }
  }

  const stats = {
    present: Array.from(attendanceRecords.values()).filter((r) => r.status === "presente").length,
    absent: Array.from(attendanceRecords.values()).filter((r) => r.status === "ausente").length,
    late: Array.from(attendanceRecords.values()).filter((r) => r.status === "tarde").length,
    excused: Array.from(attendanceRecords.values()).filter((r) => r.status === "justificado").length,
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <Link href="/dashboard/parish-management">
          <Button variant="ghost" className="text-amber-900 hover:bg-amber-100 mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Gestión Parroquial
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-amber-900 mb-2">Tomar Asistencia</h1>
        <p className="text-amber-700">
          {level && `Nivel: ${level}`}
          {level && neighborhood && " • "}
          {neighborhood && `Barrio: ${neighborhood}`}
        </p>
      </div>

      <Card className="border-amber-200">
        <CardHeader>
          <CardTitle className="text-amber-900">Fecha de Asistencia</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-w-xs">
            <Label htmlFor="date" className="text-amber-900">
              Fecha *
            </Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border-amber-200 focus:border-amber-600"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700">Presentes</p>
                <p className="text-2xl font-bold text-green-900">{stats.present}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-700">Ausentes</p>
                <p className="text-2xl font-bold text-red-900">{stats.absent}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-700">Tardanzas</p>
                <p className="text-2xl font-bold text-orange-900">{stats.late}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700">Justificados</p>
                <p className="text-2xl font-bold text-blue-900">{stats.excused}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-amber-200">
        <CardHeader>
          <CardTitle className="text-amber-900">Lista de Estudiantes</CardTitle>
          <CardDescription className="text-amber-700">{students.length} estudiante(s) en este grupo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {students.map((student) => {
              const record = attendanceRecords.get(student.id) || { status: "presente" as AttendanceStatus, notes: "" }
              return (
                <Card key={student.id} className={`border-2 ${getStatusColor(record.status)}`}>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">
                            {student.first_name} {student.last_name}
                          </h3>
                          <p className="text-sm text-amber-700">
                            {student.grade} • {student.address || "Sin barrio"}
                          </p>
                        </div>
                        {getStatusIcon(record.status)}
                      </div>

                      <div className="grid grid-cols-4 gap-2">
                        <Button
                          size="sm"
                          variant={record.status === "presente" ? "default" : "outline"}
                          onClick={() => updateAttendance(student.id, "presente")}
                          className={
                            record.status === "presente"
                              ? "bg-green-600 hover:bg-green-700"
                              : "border-green-300 text-green-700 hover:bg-green-50"
                          }
                        >
                          Presente
                        </Button>
                        <Button
                          size="sm"
                          variant={record.status === "ausente" ? "default" : "outline"}
                          onClick={() => updateAttendance(student.id, "ausente")}
                          className={
                            record.status === "ausente"
                              ? "bg-red-600 hover:bg-red-700"
                              : "border-red-300 text-red-700 hover:bg-red-50"
                          }
                        >
                          Ausente
                        </Button>
                        <Button
                          size="sm"
                          variant={record.status === "tarde" ? "default" : "outline"}
                          onClick={() => updateAttendance(student.id, "tarde")}
                          className={
                            record.status === "tarde"
                              ? "bg-orange-600 hover:bg-orange-700"
                              : "border-orange-300 text-orange-700 hover:bg-orange-50"
                          }
                        >
                          Tarde
                        </Button>
                        <Button
                          size="sm"
                          variant={record.status === "justificado" ? "default" : "outline"}
                          onClick={() => updateAttendance(student.id, "justificado")}
                          className={
                            record.status === "justificado"
                              ? "bg-blue-600 hover:bg-blue-700"
                              : "border-blue-300 text-blue-700 hover:bg-blue-50"
                          }
                        >
                          Justificado
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`notes-${student.id}`} className="text-sm">
                          Notas (opcional)
                        </Label>
                        <Textarea
                          id={`notes-${student.id}`}
                          placeholder="Agregar observaciones..."
                          value={record.notes}
                          onChange={(e) => updateNotes(student.id, e.target.value)}
                          className="border-amber-200 focus:border-amber-600 min-h-16"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}

            {students.length === 0 && (
              <div className="text-center py-12">
                <p className="text-amber-700">No hay estudiantes en este grupo</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {students.length > 0 && (
        <div className="flex gap-4">
          <Button onClick={handleSave} className="flex-1 bg-amber-600 hover:bg-amber-700 text-white">
            <Save className="mr-2 h-4 w-4" />
            Guardar Asistencia
          </Button>
          <Link href="/dashboard/parish-management" className="flex-1">
            <Button
              variant="outline"
              className="w-full border-amber-300 text-amber-900 hover:bg-amber-100 bg-transparent"
            >
              Cancelar
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}

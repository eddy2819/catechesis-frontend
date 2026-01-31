"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { dataStore } from "@/lib/store"
import type { Student } from "@/lib/types"
import { AlertCircle, ArrowLeft, CheckCircle, Church, Clock, Save, XCircle } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react"

function GeneralMeetingContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [students, setStudents] = useState<Student[]>([])
  const [meetingDate, setMeetingDate] = useState(new Date().toISOString().split("T")[0])
  const [meetingType, setMeetingType] = useState<"general" | "priest" | "sacrament" | "special">("general")
  const [attendanceRecords, setAttendanceRecords] = useState<
    Map<string, { status: "present" | "absent" | "late" | "excused"; notes: string }>
  >(new Map())
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const level = searchParams.get("level")
    const address = searchParams.get("neighborhood")

    let allStudents = dataStore.getStudents()

    if (level && level !== "all") {
      allStudents = allStudents.filter((s) => s.grade === level)
    }

    if (address && address !== "all") {
      allStudents = allStudents.filter((s) => s.address === address)
    }

    setStudents(allStudents)
  }, [searchParams])

  useEffect(() => {
    if (students.length === 0) return

    const existingAttendances = dataStore.getGeneralMeetingAttendancesByDate(new Date(meetingDate))
    const recordsMap = new Map()
    existingAttendances.forEach((att) => {
      recordsMap.set(att.studentId, { status: att.status, notes: att.notes || "" })
    })
    setAttendanceRecords(recordsMap)
  }, [meetingDate, students.length])

  const handleStatusChange = (studentId: string, status: "present" | "absent" | "late" | "excused") => {
    const newRecords = new Map(attendanceRecords)
    const existing = newRecords.get(studentId) || { status: "absent", notes: "" }
    newRecords.set(studentId, { ...existing, status })
    setAttendanceRecords(newRecords)
  }

  const handleNotesChange = (studentId: string, notes: string) => {
    const newRecords = new Map(attendanceRecords)
    const existing = newRecords.get(studentId) || { status: "absent", notes: "" }
    newRecords.set(studentId, { ...existing, notes })
    setAttendanceRecords(newRecords)
  }

  const handleSave = () => {
    const date = new Date(meetingDate)

    students.forEach((student) => {
      const record = attendanceRecords.get(student.id)
      if (record) {
        const existing = dataStore.getGeneralMeetingAttendanceByStudentAndDate(student.id, date)

        if (existing) {
          dataStore.updateGeneralMeetingAttendance(existing.id, {
            status: record.status,
            notes: record.notes,
            meetingType,
          })
        } else {
          dataStore.addGeneralMeetingAttendance({
            studentId: student.id,
            meetingDate: date,
            status: record.status,
            notes: record.notes,
            meetingType,
          })
        }
      }
    })

    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const getStats = () => {
    let present = 0
    let absent = 0
    let late = 0
    let excused = 0

    attendanceRecords.forEach((record) => {
      switch (record.status) {
        case "present":
          present++
          break
        case "absent":
          absent++
          break
        case "late":
          late++
          break
        case "excused":
          excused++
          break
      }
    })

    return { present, absent, late, excused }
  }

  const stats = getStats()
  const statusIcons = {
    present: <CheckCircle className="h-4 w-4 text-green-600" />,
    absent: <XCircle className="h-4 w-4 text-red-600" />,
    late: <Clock className="h-4 w-4 text-orange-600" />,
    excused: <AlertCircle className="h-4 w-4 text-blue-600" />,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Church className="h-8 w-8 text-amber-600" />
            <h1 className="text-3xl font-bold text-amber-900">Reunión General</h1>
          </div>
          <p className="text-amber-700">Registra la asistencia de estudiantes a la reunión</p>
        </div>
        <Link href="/dashboard/parish-management">
          <Button variant="outline" className="border-amber-300 text-amber-900 hover:bg-amber-100 bg-transparent">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-amber-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-amber-700 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Presentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-900">{stats.present}</div>
          </CardContent>
        </Card>

        <Card className="border-amber-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-amber-700 flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-600" />
              Ausentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-900">{stats.absent}</div>
          </CardContent>
        </Card>

        <Card className="border-amber-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-amber-700 flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-600" />
              Tarde
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-900">{stats.late}</div>
          </CardContent>
        </Card>

        <Card className="border-amber-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-amber-700 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              Justificados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-900">{stats.excused}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-amber-200">
        <CardHeader>
          <CardTitle className="text-amber-900">Configuración de la Reunión</CardTitle>
          <CardDescription className="text-amber-700">Selecciona la fecha y tipo de reunión</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="meeting-date" className="text-amber-900">
                Fecha de la Reunión
              </Label>
              <Input
                id="meeting-date"
                type="date"
                value={meetingDate}
                onChange={(e) => setMeetingDate(e.target.value)}
                className="border-amber-200 focus:border-amber-600"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="meeting-type" className="text-amber-900">
                Tipo de Reunión
              </Label>
              <Select value={meetingType} onValueChange={(value: any) => setMeetingType(value)}>
                <SelectTrigger className="border-amber-200 focus:border-amber-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">Reunión General</SelectItem>
                  <SelectItem value="priest">Con Sacerdote</SelectItem>
                  <SelectItem value="sacrament">Preparación Sacramental</SelectItem>
                  <SelectItem value="special">Evento Especial</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-amber-200">
        <CardHeader>
          <CardTitle className="text-amber-900">Lista de Asistencia</CardTitle>
          <CardDescription className="text-amber-700">{students.length} estudiantes registrados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-amber-200 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-amber-50 hover:bg-amber-50">
                  <TableHead className="text-amber-900">Estudiante</TableHead>
                  <TableHead className="text-amber-900">Nivel</TableHead>
                  <TableHead className="text-amber-900">Barrio</TableHead>
                  <TableHead className="text-amber-900">Estado</TableHead>
                  <TableHead className="text-amber-900">Notas</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => {
                  const record = attendanceRecords.get(student.id) || { status: "absent" as const, notes: "" }
                  return (
                    <TableRow key={student.id} className="hover:bg-amber-50/50">
                      <TableCell className="font-medium text-amber-900">
                        {student.first_name} {student.last_name}
                      </TableCell>
                      <TableCell className="text-amber-800">{student.grade}</TableCell>
                      <TableCell className="text-amber-800">{student.address || "Sin barrio"}</TableCell>
                      <TableCell>
                        <Select
                          value={record.status}
                          onValueChange={(value: any) => handleStatusChange(student.id, value)}
                        >
                          <SelectTrigger className="w-[140px] border-amber-200 focus:border-amber-600">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="present">
                              <div className="flex items-center gap-2">
                                {statusIcons.present}
                                Presente
                              </div>
                            </SelectItem>
                            <SelectItem value="absent">
                              <div className="flex items-center gap-2">
                                {statusIcons.absent}
                                Ausente
                              </div>
                            </SelectItem>
                            <SelectItem value="late">
                              <div className="flex items-center gap-2">
                                {statusIcons.late}
                                Tarde
                              </div>
                            </SelectItem>
                            <SelectItem value="excused">
                              <div className="flex items-center gap-2">
                                {statusIcons.excused}
                                Justificado
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input
                          placeholder="Notas opcionales..."
                          value={record.notes}
                          onChange={(e) => handleNotesChange(student.id, e.target.value)}
                          className="border-amber-200 focus:border-amber-600"
                        />
                      </TableCell>
                    </TableRow>
                  )
                })}
                {students.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-amber-700">
                      No hay estudiantes para registrar
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {students.length > 0 && (
            <div className="mt-6 flex gap-4">
              <Button onClick={handleSave} className="flex-1 bg-amber-600 hover:bg-amber-700 text-white">
                <Save className="mr-2 h-4 w-4" />
                Guardar Asistencia
              </Button>
              {saved && (
                <Badge className="bg-green-600 px-4 py-2">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Guardado exitosamente
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function GeneralMeetingPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <GeneralMeetingContent />
    </Suspense>
  )
}

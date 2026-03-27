"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createStudentAttendance, getAttendanceByDate, listStudents, updateAttendance } from "@/lib/students"
import type { Attendance, Student } from "@/lib/types"
import { AlertCircle, ArrowLeft, Check, Clock, RefreshCw, Save, Search, X } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function StudentAttendancePage() {
  const router = useRouter()
  const params = useParams()
  const dateStr = params.date as string
  const selectedDate = new Date(dateStr)

  const [students, setStudents] = useState<Student[]>([])
  const [attendanceRecords, setAttendanceRecords] = useState<Map<string, Attendance>>(new Map())
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
      const fetchStudents = async () => {
          try {
            const allStudents = (await listStudents()) as Student[]
            const activeStudents = allStudents.filter((s) => s.status === "active");
            setStudents(activeStudents);

            const attendace = await  getAttendanceByDate(selectedDate.toISOString().split('T')[0]);
            const map = new Map<string, Attendance>();
            // Normalize API attendance shape to our local Attendance type
            attendace.forEach((record: any) => {
              const studentId = (record.studentId ?? record.student_id) as string;
              const normalized: Attendance = {
                id: record.id,
                date: record.date ? new Date(record.date) : selectedDate,
                status: record.status,
                notes: record.notes,
                absence_justification: record.absence_justification,
              };
              map.set(studentId, normalized);
            });
            setAttendanceRecords(map);

            
          } catch (error) {
            console.error("Error fetching students:", error);
          } finally  {
            setLoading(false);
          
          }
    }
    fetchStudents()
  }, [dateStr])

  const handleStatusChange = async (studentId: string, status: Attendance["status"]) => {
    const existing = attendanceRecords.get(studentId)
    const dateStr = selectedDate.toISOString().split('T')[0]
    
    if (existing) {
      const updated = (await updateAttendance(studentId, dateStr, { status })) as Attendance
      const newMap = new Map(attendanceRecords)
      newMap.set(studentId, updated)
      setAttendanceRecords(newMap)
    } else {
      const payload ={
        date: dateStr,
        status,
        notes: ''
      }

      const newRecord = (await createStudentAttendance(studentId, payload)) as Attendance
      const newMap = new Map(attendanceRecords)
      newMap.set(studentId, newRecord)
      setAttendanceRecords(newMap)
    }
  }

  const handleNotesChange = async (studentId: string, notes: string) => {
    const existing = attendanceRecords.get(studentId)
    const dateStr = selectedDate.toISOString().split('T')[0]
    
    if (existing) {
      const updated = await updateAttendance(studentId, dateStr, { notes }) as Attendance | undefined
      if (updated) {
        const newMap = new Map(attendanceRecords)
        newMap.set(studentId, updated)
        setAttendanceRecords(newMap)
      }
    }
  }

  const handleJustificationChange = async (studentId: string, justification: string) => {
    const existing = attendanceRecords.get(studentId)
    const dateStr = selectedDate.toISOString().split('T')[0]
    
    if (existing) {
      const updated = await updateAttendance(studentId, dateStr, { absence_justification: justification }) as Attendance | undefined
      if (updated) {
        const newMap = new Map(attendanceRecords)
        newMap.set(studentId, updated)
        setAttendanceRecords(newMap)
      }
    }
  }

  const handleToggleAttendance = async (studentId: string) => {
    const existing = attendanceRecords.get(studentId)
    const dateStr = selectedDate.toISOString().split('T')[0]
    
    try {
      if (existing) {
        // Si existe, cambiar de presente a ausente o viceversa
        const newStatus: Attendance["status"] = existing.status === "presente" ? "ausente" : "presente"
        const updated = (await updateAttendance(studentId, dateStr, { status: newStatus })) as Attendance
        const newMap = new Map(attendanceRecords)
        newMap.set(studentId, updated)
        setAttendanceRecords(newMap)
      } else {
        // Si no existe, crear con estado "presente" por defecto
        const payload = {
          date: dateStr,
          status: "presente" as const,
          notes: ''
        }
        const newRecord = (await createStudentAttendance(studentId, payload)) as Attendance
        const newMap = new Map(attendanceRecords)
        newMap.set(studentId, newRecord)
        setAttendanceRecords(newMap)
      }
    } catch (error) {
      console.error("Error toggling attendance:", error)
    }
  }

  const getStatusColor = (status: Attendance["status"]) => {
    switch (status) {
      case "presente":
        return "bg-green-100 text-green-800 border-green-300"
      case "ausente":
        return "bg-red-100 text-red-800 border-red-300"
      case "tarde":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      case "justificado":
        return "bg-blue-100 text-blue-800 border-blue-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  const getStatusIcon = (status: Attendance["status"]) => {
    switch (status) {
      case "presente":
        return <Check className="w-4 h-4" />
      case "ausente":
        return <X className="w-4 h-4" />
      case "tarde":
        return <Clock className="w-4 h-4" />
      case "justificado":
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

  const stats = {
    present: Array.from(attendanceRecords.values()).filter((r) => r.status === "presente").length,
    absent: Array.from(attendanceRecords.values()).filter((r) => r.status === "ausente").length,
    late: Array.from(attendanceRecords.values()).filter((r) => r.status === "tarde").length,
    excused: Array.from(attendanceRecords.values()).filter((r) => r.status === "justificado").length,
  }

  const getFilteredStudents = () => {
    if (!searchTerm.trim()) {
      return students
    }
    const term = searchTerm.toLowerCase().trim()
    return students.filter((student) => {
      const fullName = `${student.first_name} ${student.last_name}`.toLowerCase()
      return fullName.includes(term)
    })
  }

  const filteredStudents = getFilteredStudents()

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
          <h1 className="text-3xl font-bold text-amber-900">Asistencia de Estudiantes</h1>
          <p className="text-amber-700 mt-1 capitalize">{formatDate(selectedDate)}</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
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
        <Card className="border-yellow-300 bg-yellow-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-yellow-900">Tarde</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-900">{stats.late}</div>
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
          <CardTitle className="text-amber-900">Lista de Estudiantes</CardTitle>
          <CardDescription>Marca la asistencia de cada estudiante</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-amber-500" />
              <input
                type="text"
                placeholder="Buscar por nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-amber-900 placeholder-amber-600"
              />
            </div>
            {searchTerm && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSearchTerm("")}
                className="text-amber-700 hover:bg-amber-100"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          {filteredStudents.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-amber-700">
                {searchTerm ? "No se encontraron estudiantes con ese nombre" : "No hay estudiantes"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredStudents.map((student) => {
                const record = attendanceRecords.get(student.id)
                const status = record?.status

                return (
                  <div key={student.id} className="border border-amber-200 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-amber-900">
                        {student.first_name} {student.last_name}
                      </h3>
                      <p className="text-sm text-amber-700">{student.grade}</p>
                    </div>
                    {status && (
                      <div
                        className={`px-3 py-1 rounded-full border flex items-center gap-2 ${getStatusColor(status)}`}
                      >
                        {getStatusIcon(status)}
                        <span className="text-sm font-medium capitalize">
                          {status === "presente"
                            ? "Presente"
                            : status === "ausente"
                              ? "Ausente"
                              : status === "tarde"
                                ? "Tarde"
                                : "Justificado"}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={status === "presente" ? "default" : "outline"}
                      className={
                        status === "presente"
                          ? "bg-green-600 hover:bg-green-700"
                          : "border-green-300 text-green-700 hover:bg-green-50"
                      }
                      onClick={() => handleStatusChange(student.id, "presente")}
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Presente
                    </Button>
                    <Button
                      size="sm"
                      variant={status === "ausente" ? "default" : "outline"}
                      className={
                        status === "ausente"
                          ? "bg-red-600 hover:bg-red-700"
                          : "border-red-300 text-red-700 hover:bg-red-50"
                      }
                      onClick={() => handleStatusChange(student.id, "ausente")}
                    >
                      <X className="w-4 h-4 mr-1" />
                      Ausente
                    </Button>
                    <Button
                      size="sm"
                      variant={status === "tarde" ? "default" : "outline"}
                      className={
                        status === "tarde"
                          ? "bg-yellow-600 hover:bg-yellow-700"
                          : "border-yellow-300 text-yellow-700 hover:bg-yellow-50"
                      }
                      onClick={() => handleStatusChange(student.id, "tarde")}
                    >
                      <Clock className="w-4 h-4 mr-1" />
                      Tarde
                    </Button>
                    <Button
                      size="sm"
                      variant={status === "justificado" ? "default" : "outline"}
                      className={
                        status === "justificado"
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "border-blue-300 text-blue-700 hover:bg-blue-50"
                      }
                      onClick={() => handleStatusChange(student.id, "justificado")}
                    >
                      <AlertCircle className="w-4 h-4 mr-1" />
                      Justificado
                    </Button>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="bg-purple-100 text-purple-700 border border-purple-300 hover:bg-purple-200"
                      onClick={() => handleToggleAttendance(student.id)}
                      title="Cambiar rápidamente entre Presente y Ausente"
                    >
                      <RefreshCw className="w-4 h-4 mr-1" />
                      Toggle Rápido
                    </Button>
                  </div>

                  {record && (
                    <div className="space-y-3">
                      {status === "ausente" && (
                        <div className="bg-red-50 border border-red-300 rounded-lg p-3">
                          <label className="text-sm font-medium text-red-900 mb-1 block">Justificación de la Falta</label>
                          <textarea
                            placeholder="Ingrese la justificación de la ausencia (ej: Enfermedad, Problema familiar, Viaje urgente)..."
                            value={record.absence_justification || ""}
                            onChange={(e) => handleJustificationChange(student.id, e.target.value)}
                            className="w-full px-3 py-2 border border-red-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                            rows={2}
                          />
                        </div>
                      )}
                      <div>
                        <label className="text-sm font-medium text-amber-900 mb-1 block">Notas</label>
                        <input
                          type="text"
                          placeholder="Agregar notas opcionales..."
                          value={record.notes || ""}
                          onChange={(e) => handleNotesChange(student.id, e.target.value)}
                          className="w-full px-3 py-2 border border-amber-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
            </div>
          )}
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

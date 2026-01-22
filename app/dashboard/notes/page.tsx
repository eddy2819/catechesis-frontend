"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, FileText } from "lucide-react"
import { dataStore } from "@/lib/store"
import type { Note, Student } from "@/lib/types"
import { useAuth } from "@/lib/auth-context"

export default function NotesPage() {
  const { user } = useAuth()
  const [notes, setNotes] = useState<Note[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<string>("all")

  useEffect(() => {
    setNotes(dataStore.getNotes())
    setStudents(dataStore.getStudents())
  }, [])

  const getStudentName = (studentId: string) => {
    const student = students.find((s) => s.id === studentId)
    return student ? `${student.firstName} ${student.lastName}` : "Desconocido"
  }

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getStudentName(note.studentId).toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === "all" || note.type === filterType
    return matchesSearch && matchesType
  })

  const noteTypeLabels = {
    behavior: "Comportamiento",
    academic: "Académico",
    pastoral: "Pastoral",
    general: "General",
  }

  const noteTypeColors = {
    behavior: "bg-orange-500",
    academic: "bg-blue-500",
    pastoral: "bg-purple-500",
    general: "bg-gray-500",
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-amber-900 mb-2">Notas y Observaciones</h1>
          <p className="text-amber-700">Registra observaciones sobre los estudiantes</p>
        </div>
        <Link href="/dashboard/notes/new">
          <Button className="bg-amber-600 hover:bg-amber-700 text-white">
            <Plus className="mr-2 h-4 w-4" />
            Nueva Nota
          </Button>
        </Link>
      </div>

      <Card className="border-amber-200 mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-amber-500" />
              <Input
                placeholder="Buscar notas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-amber-200 focus:border-amber-600"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterType === "all" ? "default" : "outline"}
                onClick={() => setFilterType("all")}
                className={filterType === "all" ? "bg-amber-600" : "border-amber-300 text-amber-900 bg-transparent"}
              >
                Todas
              </Button>
              {Object.entries(noteTypeLabels).map(([type, label]) => (
                <Button
                  key={type}
                  variant={filterType === type ? "default" : "outline"}
                  onClick={() => setFilterType(type)}
                  className={filterType === type ? "bg-amber-600" : "border-amber-300 text-amber-900 bg-transparent"}
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {filteredNotes.length === 0 ? (
        <Card className="border-amber-200">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-16 w-16 text-amber-300 mb-4" />
            <p className="text-amber-700 text-center mb-4">
              {searchQuery || filterType !== "all" ? "No se encontraron notas" : "No hay notas registradas"}
            </p>
            {!searchQuery && filterType === "all" && (
              <Link href="/dashboard/notes/new">
                <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Primera Nota
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredNotes.map((note) => (
            <Card key={note.id} className="border-amber-200 hover:border-amber-400 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-lg text-amber-900">{getStudentName(note.studentId)}</CardTitle>
                      <Badge className={`${noteTypeColors[note.type]} text-white`}>{noteTypeLabels[note.type]}</Badge>
                      {note.isPrivate && (
                        <Badge variant="outline" className="border-amber-300 text-amber-700">
                          Privada
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="text-amber-700">
                      {new Date(note.date).toLocaleDateString("es-ES", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-amber-900 whitespace-pre-wrap">{note.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

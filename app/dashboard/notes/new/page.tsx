"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { dataStore } from "@/lib/store"
import type { Student } from "@/lib/types"
import { useAuth } from "@/lib/auth-context"

export default function NewNotePage() {
  const router = useRouter()
  const { user } = useAuth()
  const [students, setStudents] = useState<Student[]>([])
  const [formData, setFormData] = useState({
    studentId: "",
    content: "",
    type: "general" as "behavior" | "academic" | "pastoral" | "general",
    isPrivate: false,
  })

  useEffect(() => {
    setStudents(dataStore.getStudents())
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) return

    const note = {
      studentId: formData.studentId,
      date: new Date(),
      content: formData.content,
      type: formData.type,
      catechistId: user.id,
      isPrivate: formData.isPrivate,
    }

    dataStore.addNote(note)
    router.push("/dashboard/notes")
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <Link href="/dashboard/notes">
          <Button variant="ghost" className="text-amber-900 hover:bg-amber-100 mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Notas
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-amber-900 mb-2">Nueva Nota</h1>
        <p className="text-amber-700">Registra una observación sobre un estudiante</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-amber-200">
              <CardHeader>
                <CardTitle className="text-amber-900">Información de la Nota</CardTitle>
                <CardDescription className="text-amber-700">Detalles de la observación</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="studentId" className="text-amber-900">
                    Estudiante *
                  </Label>
                  <Select
                    value={formData.studentId}
                    onValueChange={(value) => setFormData({ ...formData, studentId: value })}
                  >
                    <SelectTrigger className="border-amber-200 focus:border-amber-600">
                      <SelectValue placeholder="Seleccionar estudiante" />
                    </SelectTrigger>
                    <SelectContent>
                      {students.map((student) => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.firstName} {student.lastName} - {student.grade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type" className="text-amber-900">
                    Tipo de Nota *
                  </Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: "behavior" | "academic" | "pastoral" | "general") =>
                      setFormData({ ...formData, type: value })
                    }
                  >
                    <SelectTrigger className="border-amber-200 focus:border-amber-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="behavior">Comportamiento</SelectItem>
                      <SelectItem value="academic">Académico</SelectItem>
                      <SelectItem value="pastoral">Pastoral</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content" className="text-amber-900">
                    Contenido *
                  </Label>
                  <Textarea
                    id="content"
                    required
                    placeholder="Escribe tu observación aquí..."
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="border-amber-200 focus:border-amber-600 min-h-32"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isPrivate"
                    checked={formData.isPrivate}
                    onCheckedChange={(checked) => setFormData({ ...formData, isPrivate: checked as boolean })}
                  />
                  <Label htmlFor="isPrivate" className="text-amber-900 font-normal cursor-pointer">
                    Nota privada (solo visible para catequistas)
                  </Label>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-amber-200 bg-amber-50">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <Button
                    type="submit"
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                    disabled={!formData.studentId || !formData.content}
                  >
                    Guardar Nota
                  </Button>
                  <Link href="/dashboard/notes" className="block">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border-amber-300 text-amber-900 bg-transparent"
                    >
                      Cancelar
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}

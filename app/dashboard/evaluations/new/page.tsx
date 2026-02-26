"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/lib/auth-context"
import { dataStore } from "@/lib/store"
import { listStudents } from "@/lib/students"
import type { Student } from "@/lib/types"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function NewEvaluationPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [students, setStudents] = useState<Student[]>([])
  const [formData, setFormData] = useState({
    studentId: "",
    category: "",
    score: "",
    observations: "",
  })

  useEffect(() => {
    const loadStudents = async () => {
      const studentList = await listStudents()
      setStudents(studentList as Student[])
    }
    loadStudents()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) return

    const evaluation = {
      studentId: formData.studentId,
      date: new Date(),
      category: formData.category,
      score: formData.score ? Number(formData.score) : undefined,
      observations: formData.observations,
      catechistId: user.id,
    }

    dataStore.addEvaluation(evaluation)
    router.push("/dashboard/evaluations")
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <Link href="/dashboard/evaluations">
          <Button variant="ghost" className="text-amber-900 hover:bg-amber-100 mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Evaluaciones
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-amber-900 mb-2">Nueva Evaluación</h1>
        <p className="text-amber-700">Registra una evaluación de un estudiante</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-amber-200">
              <CardHeader>
                <CardTitle className="text-amber-900">Información de la Evaluación</CardTitle>
                <CardDescription className="text-amber-700">Detalles de la evaluación</CardDescription>
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
                          {student.first_name} {student.last_name} - {student.grade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-amber-900">
                      Categoría *
                    </Label>
                    <Input
                      id="category"
                      required
                      placeholder="Ej: Conocimiento de oraciones, Participación..."
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="border-amber-200 focus:border-amber-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="score" className="text-amber-900">
                      Puntuación (0-100)
                    </Label>
                    <Input
                      id="score"
                      type="number"
                      min="0"
                      max="100"
                      placeholder="Opcional"
                      value={formData.score}
                      onChange={(e) => setFormData({ ...formData, score: e.target.value })}
                      className="border-amber-200 focus:border-amber-600"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="observations" className="text-amber-900">
                    Observaciones *
                  </Label>
                  <Textarea
                    id="observations"
                    required
                    placeholder="Describe el desempeño del estudiante..."
                    value={formData.observations}
                    onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                    className="border-amber-200 focus:border-amber-600 min-h-32"
                  />
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
                    disabled={!formData.studentId || !formData.category || !formData.observations}
                  >
                    Guardar Evaluación
                  </Button>
                  <Link href="/dashboard/evaluations" className="block">
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

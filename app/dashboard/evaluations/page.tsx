"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, ClipboardCheck } from "lucide-react"
import { dataStore } from "@/lib/store"
import type { Evaluation, Student } from "@/lib/types"

export default function EvaluationsPage() {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    setEvaluations(dataStore.getEvaluations())
    setStudents(dataStore.getStudents())
  }, [])

  const getStudentName = (studentId: string) => {
    const student = students.find((s) => s.id === studentId)
    return student ? `${student.firstName} ${student.lastName}` : "Desconocido"
  }

  const filteredEvaluations = evaluations.filter(
    (evaluation) =>
      evaluation.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getStudentName(evaluation.studentId).toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getScoreColor = (score?: number) => {
    if (!score) return "bg-gray-500"
    if (score >= 90) return "bg-green-500"
    if (score >= 70) return "bg-blue-500"
    if (score >= 50) return "bg-orange-500"
    return "bg-red-500"
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-amber-900 mb-2">Evaluaciones</h1>
          <p className="text-amber-700">Registra el progreso y evaluaciones de los estudiantes</p>
        </div>
        <Link href="/dashboard/evaluations/new">
          <Button className="bg-amber-600 hover:bg-amber-700 text-white">
            <Plus className="mr-2 h-4 w-4" />
            Nueva Evaluación
          </Button>
        </Link>
      </div>

      <Card className="border-amber-200 mb-6">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-amber-500" />
            <Input
              placeholder="Buscar evaluaciones..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-amber-200 focus:border-amber-600"
            />
          </div>
        </CardContent>
      </Card>

      {filteredEvaluations.length === 0 ? (
        <Card className="border-amber-200">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ClipboardCheck className="h-16 w-16 text-amber-300 mb-4" />
            <p className="text-amber-700 text-center mb-4">
              {searchQuery ? "No se encontraron evaluaciones" : "No hay evaluaciones registradas"}
            </p>
            {!searchQuery && (
              <Link href="/dashboard/evaluations/new">
                <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Primera Evaluación
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvaluations.map((evaluation) => (
            <Card key={evaluation.id} className="border-amber-200 hover:border-amber-400 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg text-amber-900">{getStudentName(evaluation.studentId)}</CardTitle>
                    <CardDescription className="text-amber-700">{evaluation.category}</CardDescription>
                  </div>
                  {evaluation.score !== undefined && (
                    <Badge className={`${getScoreColor(evaluation.score)} text-white`}>{evaluation.score}%</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-amber-700 mb-2">
                  {new Date(evaluation.date).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="text-sm text-amber-900 line-clamp-3">{evaluation.observations}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

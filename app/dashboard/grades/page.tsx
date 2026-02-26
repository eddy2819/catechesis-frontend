"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { dataStore } from "@/lib/store"
import { listStudents } from "@/lib/students"
import type { Assignment, Grade, Student } from "@/lib/types"
import { Plus, Save, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"

export default function GradesPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [grades, setGrades] = useState<Grade[]>([])
  const [editingGrades, setEditingGrades] = useState<Record<string, string>>({})
  const [isAddingAssignment, setIsAddingAssignment] = useState(false)

  // New assignment form state
  const [newAssignment, setNewAssignment] = useState({
    name: "",
    date: new Date().toISOString().split("T")[0],
    type: "tarea" as "tarea" | "taller" | "examen" | "proyecto",
    maxScore: 100,
    description: "",
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const studentsData = await listStudents()
      setStudents(studentsData as Student[])
      setAssignments(dataStore.getAssignments().sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()))
      setGrades(dataStore.getGrades())
    } catch (error) {
      console.error("Error loading data:", error)
    }
  }

  const handleAddAssignment = () => {
    if (!newAssignment.name.trim()) return

    dataStore.addAssignment({
      name: newAssignment.name,
      date: new Date(newAssignment.date),
      type: newAssignment.type,
      maxScore: newAssignment.maxScore,
      description: newAssignment.description,
    })

    setNewAssignment({
      name: "",
      date: new Date().toISOString().split("T")[0],
      type: "tarea",
      maxScore: 100,
      description: "",
    })
    setIsAddingAssignment(false)
    loadData()
  }

  const handleDeleteAssignment = (assignmentId: string) => {
    if (confirm("¿Estás seguro de eliminar esta tarea/actividad y todas sus calificaciones?")) {
      dataStore.deleteAssignment(assignmentId)
      loadData()
    }
  }

  const getGradeValue = (studentId: string, assignmentId: string): string => {
    const key = `${studentId}-${assignmentId}`
    if (editingGrades[key] !== undefined) {
      return editingGrades[key]
    }
    const grade = grades.find((g) => g.studentId === studentId && g.assignmentId === assignmentId)
    return grade ? grade.score.toString() : ""
  }

  const handleGradeChange = (studentId: string, assignmentId: string, value: string) => {
    const key = `${studentId}-${assignmentId}`
    setEditingGrades((prev) => ({ ...prev, [key]: value }))
  }

  const handleSaveGrade = (studentId: string, assignmentId: string) => {
    const key = `${studentId}-${assignmentId}`
    const value = editingGrades[key]

    if (value === undefined || value === "") {
      // Delete grade if empty
      const existingGrade = grades.find((g) => g.studentId === studentId && g.assignmentId === assignmentId)
      if (existingGrade) {
        dataStore.deleteGrade(existingGrade.id)
      }
    } else {
      const score = Number.parseFloat(value)
      if (isNaN(score)) return

      const existingGrade = grades.find((g) => g.studentId === studentId && g.assignmentId === assignmentId)

      if (existingGrade) {
        dataStore.updateGrade(existingGrade.id, { score })
      } else {
        dataStore.addGrade({
          studentId,
          assignmentId,
          score,
          submittedAt: new Date(),
        })
      }
    }

    // Remove from editing state
    setEditingGrades((prev) => {
      const newState = { ...prev }
      delete newState[key]
      return newState
    })

    loadData()
  }

  const getStudentAverage = (studentId: string): number => {
    const studentGrades = grades.filter((g) => g.studentId === studentId)
    if (studentGrades.length === 0) return 0

    const total = studentGrades.reduce((sum, grade) => {
      const assignment = assignments.find((a) => a.id === grade.assignmentId)
      if (!assignment) return sum
      return sum + (grade.score / assignment.maxScore) * 100
    }, 0)

    return Math.round(total / studentGrades.length)
  }

  const getAssignmentAverage = (assignmentId: string): number => {
    const assignmentGrades = grades.filter((g) => g.assignmentId === assignmentId)
    if (assignmentGrades.length === 0) return 0

    const total = assignmentGrades.reduce((sum, grade) => sum + grade.score, 0)
    return Math.round(total / assignmentGrades.length)
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "tarea":
        return "bg-blue-100 text-blue-800"
      case "taller":
        return "bg-green-100 text-green-800"
      case "examen":
        return "bg-red-100 text-red-800"
      case "proyecto":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "tarea":
        return "Tarea"
      case "taller":
        return "Taller"
      case "examen":
        return "Examen"
      case "proyecto":
        return "Proyecto"
      default:
        return type
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-amber-900">Calificaciones</h1>
          <p className="text-amber-700">Registro de tareas, talleres y calificaciones</p>
        </div>

        <Dialog open={isAddingAssignment} onOpenChange={setIsAddingAssignment}>
          <DialogTrigger asChild>
            <Button className="bg-amber-600 hover:bg-amber-700">
              <Plus className="mr-2 h-4 w-4" />
              Nueva Tarea/Actividad
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Agregar Tarea/Actividad</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  value={newAssignment.name}
                  onChange={(e) => setNewAssignment({ ...newAssignment, name: e.target.value })}
                  placeholder="Ej: Tarea 1 - Los Mandamientos"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Fecha</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newAssignment.date}
                    onChange={(e) => setNewAssignment({ ...newAssignment, date: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="maxScore">Puntuación Máxima</Label>
                  <Input
                    id="maxScore"
                    type="number"
                    value={newAssignment.maxScore}
                    onChange={(e) =>
                      setNewAssignment({ ...newAssignment, maxScore: Number.parseInt(e.target.value) || 100 })
                    }
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="type">Tipo</Label>
                <Select
                  value={newAssignment.type}
                  onValueChange={(value: any) => setNewAssignment({ ...newAssignment, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tarea">Tarea</SelectItem>
                    <SelectItem value="taller">Taller</SelectItem>
                    <SelectItem value="examen">Examen</SelectItem>
                    <SelectItem value="proyecto">Proyecto</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Descripción (opcional)</Label>
                <Input
                  id="description"
                  value={newAssignment.description}
                  onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                  placeholder="Descripción breve"
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleAddAssignment} className="flex-1 bg-amber-600 hover:bg-amber-700">
                  Agregar
                </Button>
                <Button variant="outline" onClick={() => setIsAddingAssignment(false)} className="flex-1">
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {assignments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-amber-700 mb-4">No hay tareas o actividades registradas</p>
            <Button onClick={() => setIsAddingAssignment(true)} className="bg-amber-600 hover:bg-amber-700">
              <Plus className="mr-2 h-4 w-4" />
              Agregar Primera Tarea
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Libro de Calificaciones</CardTitle>
            <CardDescription>Haz clic en una celda para editar, presiona Enter o haz clic en guardar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-amber-200">
                    <th className="sticky left-0 bg-white z-10 p-3 text-left font-semibold text-amber-900 border-r-2 border-amber-200 min-w-[200px]">
                      Estudiante
                    </th>
                    {assignments.map((assignment) => (
                      <th key={assignment.id} className="p-3 text-center min-w-[150px] border-r border-amber-100">
                        <div className="space-y-1">
                          <div className="font-semibold text-amber-900 text-sm">{assignment.name}</div>
                          <div className="flex items-center justify-center gap-2">
                            <Badge className={getTypeColor(assignment.type)}>{getTypeLabel(assignment.type)}</Badge>
                            <span className="text-xs text-amber-600">
                              {new Date(assignment.date).toLocaleDateString("es-ES")}
                            </span>
                          </div>
                          <div className="text-xs text-amber-600">Max: {assignment.maxScore}</div>
                          <div className="text-xs text-amber-700 font-medium">
                            Promedio: {getAssignmentAverage(assignment.id)}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteAssignment(assignment.id)}
                            className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </th>
                    ))}
                    <th className="sticky right-0 bg-white z-10 p-3 text-center font-semibold text-amber-900 border-l-2 border-amber-200 min-w-[100px]">
                      Promedio
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id} className="border-b border-amber-100 hover:bg-amber-50">
                      <td className="sticky left-0 bg-white z-10 p-3 font-medium text-amber-900 border-r-2 border-amber-200">
                        {student.first_name} {student.last_name}
                      </td>
                      {assignments.map((assignment) => {
                        const key = `${student.id}-${assignment.id}`
                        const isEditing = editingGrades[key] !== undefined
                        const value = getGradeValue(student.id, assignment.id)

                        return (
                          <td key={assignment.id} className="p-2 text-center border-r border-amber-100">
                            <div className="flex items-center justify-center gap-1">
                              <Input
                                type="number"
                                value={value}
                                onChange={(e) => handleGradeChange(student.id, assignment.id, e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    handleSaveGrade(student.id, assignment.id)
                                  }
                                }}
                                className="w-16 h-8 text-center"
                                placeholder="-"
                                min="0"
                                max={assignment.maxScore}
                              />
                              {isEditing && (
                                <Button
                                  size="sm"
                                  onClick={() => handleSaveGrade(student.id, assignment.id)}
                                  className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700"
                                >
                                  <Save className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          </td>
                        )
                      })}
                      <td className="sticky right-0 bg-white z-10 p-3 text-center font-semibold text-amber-900 border-l-2 border-amber-200">
                        {getStudentAverage(student.id)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { TooltipProvider } from "@/components/ui/tooltip"
import { exportStudentsToPDF } from "@/lib/pdf-export"
import { listStudents } from "@/lib/students"
import type { Student } from "@/lib/types"
import { FileDown, Plus, Search, UserCircle, X } from "lucide-react"
import Link from "next/link"
import { useEffect,useMemo, useState } from "react"

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null)

  useEffect(() => {
    const fetchStudents = async() =>{
      try {
        const data = await listStudents() as Student[]
        setStudents(data)
      } catch (error) {
        console.error("Error fetching students:", error)
      }
    } 
    fetchStudents()
  }, [])

  const availableGrades = useMemo(() => {
    const grades = students.map((s) => s.grade).filter(Boolean)
    return Array.from(new Set(grades)).sort()
  }, [students])

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesSearch =
        student.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.status.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesGrade = selectedGrade ? student.grade === selectedGrade : true

      return matchesSearch && matchesGrade
    })
  }, [students, searchQuery, selectedGrade])

  const calculateAge = (dateOfBirth: Date) => {
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

   const handleClearFilters = () => {
    setSearchQuery("")
    setSelectedGrade(null)
  }

  const hasActiveFilters = searchQuery !== "" || selectedGrade !== null

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-amber-900 mb-2">Estudiantes</h1>
          <p className="text-amber-700">Gestiona la información de los estudiantes</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => exportStudentsToPDF(filteredStudents,selectedGrade)}
            className="border-amber-600 text-amber-600 hover:bg-amber-50"
            disabled={filteredStudents.length === 0}
          >
            <FileDown className="mr-2 h-4 w-4" />
            Exportar PDF
             {selectedGrade && (
              <span className="ml-1 text-xs font-normal opacity-75">({selectedGrade})</span>
            )}
          </Button>
          <Link href="/dashboard/students/new">
            <Button className="bg-amber-600 hover:bg-amber-700 text-white">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Estudiante
            </Button>
          </Link>
        </div>
      </div>

      <Card className="border-amber-200 mb-6">
        <CardContent className="pt-6 space-y-4">
          {/* Búsqueda por nombre */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-amber-500" />
            <Input
              placeholder="Buscar por nombre o estado"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-amber-200 focus:border-amber-600"
            />
          </div>

          {/* Filtro por nivel */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-amber-800">Filtrar por nivel:</span>

            <button
              onClick={() => setSelectedGrade(null)}
              className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
                selectedGrade === null
                  ? "bg-amber-600 text-white border-amber-600"
                  : "bg-white text-amber-700 border-amber-300 hover:border-amber-500 hover:bg-amber-50"
              }`}
            >
              Todos
            </button>

            {availableGrades.map((grade) => (
              <button
                key={grade}
                onClick={() => setSelectedGrade(grade === selectedGrade ? null : grade)}
                className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
                  selectedGrade === grade
                    ? "bg-amber-600 text-white border-amber-600"
                    : "bg-white text-amber-700 border-amber-300 hover:border-amber-500 hover:bg-amber-50"
                }`}
              >
                {grade}
              </button>
            ))}

            {/* Botón limpiar filtros */}
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="ml-auto flex items-center gap-1 text-sm text-amber-600 hover:text-amber-800 underline underline-offset-2"
              >
                <X className="h-3 w-3" />
                Limpiar filtros
              </button>
            )}
          </div>

          {/* Contador de resultados */}
          <p className="text-xs text-amber-600">
            {filteredStudents.length} estudiante{filteredStudents.length !== 1 ? "s" : ""} encontrado{filteredStudents.length !== 1 ? "s" : ""}
            {selectedGrade && ` en nivel "${selectedGrade}"`}
          </p>
        </CardContent>
      </Card>

      {filteredStudents.length === 0 ? (
        <Card className="border-amber-200">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <UserCircle className="h-16 w-16 text-amber-300 mb-4" />
            <p className="text-amber-700 text-center mb-4">
              {searchQuery ? "No se encontraron estudiantes" : "No hay estudiantes registrados"}
            </p>
            {!searchQuery && (
              <Link href="/dashboard/students/new">
                <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Primer Estudiante
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mr-2">
          {filteredStudents.map((student) => (
            <Link key={student.id} href={`/dashboard/students/${student.id}`}>
              <Card className="border-amber-200 hover:border-amber-400 transition-colors cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <TooltipProvider >
                      <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center overflow-hidden border border-amber-200 flex-shrink-0 mr-2">
        {student.photo_url ? (
          <img
            src={student.photo_url}
            alt={`${student.first_name} ${student.last_name}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <UserCircle className="w-10 h-10 text-amber-500" />
        )}
      </div>
                    </TooltipProvider>
                    
                    <div className="flex-1">
                      <CardTitle className="text-lg text-amber-900">
                        {student.first_name} {student.last_name}
                      </CardTitle>
                      <CardDescription className="text-amber-700">
                        {calculateAge(student.birth_date)} años • {student.grade}
                      </CardDescription>
                    </div>
                    <Badge
                      variant={student.status === "active" ? "default" : "secondary"}
                      className={student.status === "active" ? "bg-green-500" : ""}
                    >
                      {student.status === "active" ? "Activo" : "Inactivo"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    {student.sacrament?.baptism_date && (
                      <div className="flex items-center text-amber-700">
                        <span className="font-medium mr-2">Bautismo:</span>
                        <span>{new Date(student.sacrament?.baptism_date).toLocaleDateString()}</span>
                      </div>
                    )}
                    {student.sacrament?.first_communion_date && (
                      <div className="flex items-center text-amber-700">
                        <span className="font-medium mr-2">Primera Comunión:</span>
                        <span>{new Date(student.sacrament?.first_communion_date).toLocaleDateString()}</span>
                      </div>
                    )}
                    {!student.sacrament?.baptism_date && !student.sacrament?.first_communion_date && (
                      <p className="text-amber-600 italic">Sin sacramentos registrados</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

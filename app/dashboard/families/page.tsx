"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { listParents } from "@/lib/parents"
import { listStudents } from "@/lib/students"
import type { Parent, Student } from "@/lib/types"
import { Plus, Search, Users } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function FamiliesPage() {
  const [parents, setParents] = useState<Parent[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchData = async() => {
      try {
        const [parentsData, studentsData] = await Promise.all([
          listParents(),
          listStudents()
        ]);
        setParents(parentsData as Parent[]);
        setStudents(studentsData as Student[]);

      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }
    fetchData()
  }, [])

  const filteredParents = parents.filter(
    (parent) =>
      parent.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      parent.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      parent.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getStudentNames = (studentIds: string[] | undefined | null) => {
    if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
      return []; // O simplemente retorna "" si prefieres que salga vacío
    }
    
    const names = studentIds.map((studentId) => {
      const student = students.find((s) => s.id === studentId);
      return student ? `${student.first_name} ${student.last_name}` : null;
    });

    return names.filter((name) : name is string => name !== null);
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-amber-900 mb-2">Familias</h1>
          <p className="text-amber-700">Gestiona la información de padres y tutores</p>
        </div>
        <Link href="/dashboard/families/new">
          <Button className="bg-amber-600 hover:bg-amber-700 text-white">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Padre/Tutor
          </Button>
        </Link>
      </div>

      <Card className="border-amber-200 mb-6">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-amber-500" />
            <Input
              placeholder="Buscar por nombre o email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-amber-200 focus:border-amber-600"
            />
          </div>
        </CardContent>
      </Card>

      {filteredParents.length === 0 ? (
        <Card className="border-amber-200">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-16 w-16 text-amber-300 mb-4" />
            <p className="text-amber-700 text-center mb-4">
              {searchQuery ? "No se encontraron padres/tutores" : "No hay padres/tutores registrados"}
            </p>
            {!searchQuery && (
              <Link href="/dashboard/families/new">
                <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Primer Padre/Tutor
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredParents.map((parent) => {
            const studentNames = getStudentNames(parent.student_ids) 
            return (
              <Link key={parent.id} href={`/dashboard/families/${parent.id}`}>
                <Card className="border-amber-200 hover:border-amber-400 transition-colors cursor-pointer h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg text-amber-900">
                          {parent.first_name} {parent.last_name}
                        </CardTitle>
                        <CardDescription className="text-amber-700 capitalize">{parent.relationship_type}</CardDescription>
                      </div>
                      <Badge variant="outline" className="border-amber-300 text-amber-700">
                        {(parent.student_ids?.length || 0)} {(parent.student_ids?.length || 0) === 1 ? "hijo" : "hijos"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-amber-700">
                        <span className="font-medium mr-2">Email:</span>
                        <span className="truncate">{parent.email}</span>
                      </div>
                      <div className="flex items-center text-amber-700">
                        <span className="font-medium mr-2">Teléfono:</span>
                        <span>{parent.phone}</span>
                      </div>
                      {studentNames.length > 0 && (
                        <div className="pt-2 border-t border-amber-200">
                          <p className="font-medium text-amber-700 mb-1">Hijos:</p>
                          <div className="flex flex-wrap gap-1">
                            {studentNames.map((name, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs bg-amber-100 text-amber-800">
                              {name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
